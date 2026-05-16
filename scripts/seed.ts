/**
 * v1 → v2 data seed.
 *
 * Ports every v1 blog post, tips page, and gallery image into v2's Drizzle
 * tables. Source data lives in three shapes: `src/data/blogs.js` (metadata
 * array), `src/pages/BlogPage/Blogs/{country}/{n}/*.constants.ts` (per-post
 * content), and `src/data/tipsContent/*.json` (tips sections). The Google
 * Maps embed URLs live in the v1 TSX files (JSX), not in the constants, so
 * they are hardcoded here — static historical data, not worth parsing JSX.
 *
 * Output: a single idempotent SQL script at `v2/scripts/seed.sql`, wrapped
 * in `BEGIN;` / `COMMIT;`, that wipes the seeded tables and re-inserts
 * everything. Apply it against Supabase via the MCP `execute_sql` tool
 * (the direct Postgres hostname is not reachable from this dev environment;
 * the SQL file is the exchange format).
 *
 * Run with: `npm run db:seed` — this only writes the SQL file, it does NOT
 * open a Postgres connection. Type safety comes from Drizzle's `$inferInsert`
 * types on the row objects; the final step serializes them to INSERT
 * statements. UUIDs are generated client-side so child rows can reference
 * their parents without RETURNING.
 */

import { randomUUID } from "node:crypto";
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";

import type {
  NewBlogBlock,
  NewBlogItinerary,
  NewBlogItineraryItem,
  NewBlogPost,
  NewGalleryImage,
  NewTip,
  NewTipSection,
} from "../src/server/db/schema";

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const V1_BLOGS_DIR = path.join(REPO_ROOT, "src/pages/BlogPage/Blogs");
const V1_DATA_DIR = path.join(REPO_ROOT, "src/data");
const OUTPUT_SQL = path.join(__dirname, "seed.sql");
const OUTPUT_CHUNKS_DIR = path.join(__dirname, "seed");

// ---------------------------------------------------------------------------
// v1 section → v2 block translation helpers
// ---------------------------------------------------------------------------

/**
 * Cloudinary stores v1 blog assets under
 * `aroundtheworld50s/blog/{country-slug}/{post-index}/{filename-without-ext}`.
 * Public ids never include the file extension.
 */
function toBlogImagePublicId(folder: string, filename: string): string {
  const withoutExt = filename.replace(/\.[^./]+$/, "");
  return `aroundtheworld50s/blog/${folder}/${withoutExt}`;
}

/**
 * v1's router uses HashRouter, so every internal link in blog HTML looks
 * like `href="/aroundtheworld50s#/tips/..."`. v2 uses real URLs, so the
 * prefix + hash must be stripped from every embedded link before persisting
 * — missed links will be visibly broken to readers.
 */
function rewriteInternalLinks(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/href="\/aroundtheworld50s#\/tips\//g, 'href="/tips/')
    .replace(/href="\/aroundtheworld50s#\/blog\//g, 'href="/blog/')
    .replace(/href='\/aroundtheworld50s#\/tips\//g, "href='/tips/")
    .replace(/href='\/aroundtheworld50s#\/blog\//g, "href='/blog/");
}

/**
 * v1's `tipsLink` is a full HashRouter path
 * (`/aroundtheworld50s#/tips/trinidad-and-tobago`). v2 stores just the slug
 * (`trinidad-and-tobago`) and resolves it at render time.
 */
function tipsLinkToSlug(link: string | undefined | null): string | null {
  if (!link) return null;
  const match = link.match(/\/aroundtheworld50s#\/tips\/(.+)$/);
  return match ? match[1] : null;
}

/**
 * v1's two-column layout has a single `imageAlt` field, because only one
 * side is ever an image. v2's block data models alt text per side so the
 * admin can (eventually) ship two-image layouts.
 */
function splitImageAlt(layout: {
  leftType?: string;
  rightType?: string;
  imageAlt?: string;
}): { leftImageAlt?: string; rightImageAlt?: string } {
  if (!layout.imageAlt) return {};
  if (layout.leftType === "image") return { leftImageAlt: layout.imageAlt };
  if (layout.rightType === "image") return { rightImageAlt: layout.imageAlt };
  return {};
}

// ---------------------------------------------------------------------------
// v1 constants file loading
// ---------------------------------------------------------------------------

type V1Section = {
  key?: string;
  layout: {
    type: "text" | "two-column" | "image-grid" | "itinerary-with-map" | "instagram";
    leftType?: "image" | "text";
    rightType?: "image" | "text";
    imageAlt?: string;
    mapIndex?: number;
  };
  content?: string | null;
  images?: string[];
  leftImage?: string;
  rightImage?: string;
};

type V1BlogPostContent = {
  country: string;
  path: string;
  header: string;
  title: string;
  subtitle: string;
  description: string;
  tipsSection?: string;
  tipsLink?: string;
  backgroundImage?: string;
  itineraries: Array<{ title: string; items: string[] }>;
  content: V1Section[];
};

async function findConstantsFile(folder: string): Promise<string> {
  const dir = path.join(V1_BLOGS_DIR, folder);
  const files = await fs.readdir(dir);
  const match = files.find((f) => f.endsWith(".constants.ts"));
  if (!match) throw new Error(`No *.constants.ts file under ${folder}`);
  return path.join(dir, match);
}

async function loadV1BlogContent(folder: string): Promise<V1BlogPostContent> {
  const filePath = await findConstantsFile(folder);
  const mod = (await import(pathToFileURL(filePath).href)) as Record<
    string,
    unknown
  >;
  for (const value of Object.values(mod)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      "country" in value &&
      "content" in value &&
      Array.isArray((value as { content: unknown }).content)
    ) {
      return value as V1BlogPostContent;
    }
  }
  throw new Error(`No BlogPostContent export found in ${filePath}`);
}

// ---------------------------------------------------------------------------
// v1 blog metadata
// ---------------------------------------------------------------------------

type V1BlogMeta = {
  folder: string;
  country: string;
  countryCode: string;
  state?: string;
  title: string;
  backgroundImage: string;
  excerpt: string;
  createdAt: string;
};

async function loadV1BlogMetas(): Promise<V1BlogMeta[]> {
  const mod = (await import(
    pathToFileURL(path.join(V1_DATA_DIR, "blogs.js")).href
  )) as { default: Array<Record<string, string>> };
  return mod.default.map((entry) => ({
    folder: entry.folder,
    country: entry.country,
    countryCode: entry.country_code,
    state: entry.state,
    title: entry.title,
    backgroundImage: entry.background_image,
    excerpt: entry.blog_description,
    createdAt: entry.created_at,
  }));
}

// ---------------------------------------------------------------------------
// Google Maps embed URLs (extracted from v1 TSX files — these live in JSX,
// not in the constants.ts files). Posts missing from this map have no maps.
// ---------------------------------------------------------------------------

const MAP_URLS_BY_POST: Record<string, string[]> = {
  "trinidad-and-tobago/1": [
    "https://www.google.com/maps/embed?pb=!1m46!1m12!1m3!1d15683.406750899996!2d-61.526615469279044!3d10.668617917798022!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m31!3e2!4m5!1s0x8c3607d0be7ebb55%3A0x2dd4764afb66c4d6!2sThe%20BRIX%2C%20Autograph%20Collection!3m2!1d10.6730318!2d-61.5088929!4m5!1s0x8c3607b9acef9d09%3A0xebc97d2236bdd499!2sQueen's%20Hall%2C%20Saint%20Ann's%20Road%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6726361!2d-61.510602299999995!4m5!1s0x8c360876ae030299%3A0x274e0b4cadf67adb!2sStollmeyer%E2%80%99s%20Castle%20Killarney%2C%20Maraval%20Road%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.672433!2d-61.518896899999994!4m5!1s0x8c36080d3b53e269%3A0x9e8e5c91a218eccb!2sQueen's%20Park%20Oval%2C%2094%20Tragarete%20Rd%2C%20Port%20of%20Spain%2C%20Trinidad%20%26%20Tobago!3m2!1d10.667366999999999!2d-61.523711!4m5!1s0x8c3607e0e1493be1%3A0x6309c523240869dd!2sMemorial%20Park%2C%20Frederick%20Street%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6636028!2d-61.509577799999995!5e0!3m2!1sen!2sus!4v1751425484096!5m2!1sen!2sus",
    "https://www.google.com/maps/embed?pb=!1m52!1m12!1m3!1d15684.004408995012!2d-61.52428470154345!3d10.657021531751628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m37!3e2!4m5!1s0x8c36080e40b8d411%3A0x6208586c6f6dc38f!2sAriapita%20Ave%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6617622!2d-61.523201099999994!4m5!1s0x8c3607e0e1493be1%3A0x6309c523240869dd!2sMemorial%20Park%2C%20MF7R%2BC5V%2C%20Frederick%20St%2C%20Port%20of%20Spain%2C%20Trinidad%20%26%20Tobago!3m2!1d10.6636028!2d-61.509577799999995!4m5!1s0x8c3607e288036ef9%3A0x151605af19573381!2sDowntown%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.659713499999999!2d-61.5121439!4m5!1s0x8c3607fc4b99ed0b%3A0x98beed9e7918873d!2sTrinity%20Cathedral%2C%20Abercromby%20Street%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6521017!2d-61.5105016!4m5!1s0x8c3607005d63b933%3A0x6d53250b28d09a8!2sCathedral%20of%20the%20Immaculate%20Conception%2C%20Independence%20Square%20South%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6497878!2d-61.507347499999995!4m5!1s0x8c3607feaf1fecf5%3A0xdc1681a7e287d238!2sIndependence%20Square%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6501178!2d-61.504768799999994!5e0!3m2!1sen!2sus!4v1751426311391!5m2!1sen!2sus",
  ],
  "trinidad-and-tobago/2": [
    "https://www.google.com/maps/embed?pb=!1m58!1m12!1m3!1d125442.47263224369!2d-61.47073398029191!3d10.728523662202457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m43!3e2!4m5!1s0x8c3607d0be7ebb55%3A0x2dd4764afb66c4d6!2sThe%20BRIX%2C%20Autograph%20Collection%2C%20Coblentz%20Avenue%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6730318!2d-61.5088929!4m5!1s0x8c3607c454a09b73%3A0xbb469d340cd8d169!2sLady%20Young%20Rd!3m2!1d10.668149699999999!2d-61.4871851!4m5!1s0x8c3607696d6c2df5%3A0xddfd6bc9e438a485!2sSan%20Juan%2C%20Trinidad%20and%20Tobago!3m2!1d10.6497912!2d-61.4518707!4m5!1s0x8c360340cf196431%3A0x95297fed81250acf!2sLas%20Cuevas%20Beach%2C%20Trinidad%20and%20Tobago!3m2!1d10.7783555!2d-61.400871499999994!4m5!1s0x8c49e3465c4894b9%3A0x9e95f0c0b1c24fae!2sParia%20Bay%2C%20Blanchisseuse%2C%20Trinidad%20and%20Tobago!3m2!1d10.7940614!2d-61.2543271!4m5!1s0x8c36048a75922cd5%3A0x6adf3f042a6ba01b!2sMaracas%20Beach%2C%20Maracas%20Bay%20Village%2C%20Trinidad%20and%20Tobago!3m2!1d10.7587469!2d-61.439534599999995!4m5!1s0x8c3607d0be7ebb55%3A0x2dd4764afb66c4d6!2sThe%20BRIX%2C%20Autograph%20Collection%2C%20Coblentz%20Avenue%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6730318!2d-61.5088929!5e0!3m2!1sen!2sus!4v1752339544373!5m2!1sen!2sus",
  ],
  "trinidad-and-tobago/3": [
    "https://www.google.com/maps/embed?pb=!1m40!1m12!1m3!1d250998.64716139913!2d-61.44180391187146!3d10.590596775473855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m25!3e0!4m5!1s0x8c3607d0be7ebb55%3A0x2dd4764afb66c4d6!2sThe%20BRIX%2C%20Autograph%20Collection%2C%20Coblentz%20Avenue%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6730318!2d-61.5088929!4m5!1s0x8c49ff75c184d3bf%3A0xe3f0aa1c0cd2b39a!2sArima%2C%20Trinidad%20and%20Tobago!3m2!1d10.631941399999999!2d-61.284540899999996!4m5!1s0x8c49f3bc90e33e57%3A0x78dbce4df526b3d1!2sSangre%20Grande%20Regional%20Corporation%2C%20Trinidad%20and%20Tobago!3m2!1d10.6446884!2d-61.0937206!4m5!1s0x8c4a1959d9072d83%3A0x90b90eb387e28762!2sManzanilla%20Beach%2C%20Manzanilla%20Mayaro%20Road%2C%20Lower%20Manzanilla%2C%20Trinidad%20and%20Tobago!3m2!1d10.508058199999999!2d-61.0435229!5e0!3m2!1sen!2sus!4v1753758304605!5m2!1sen!2sus",
  ],
  "trinidad-and-tobago/4": [
    "https://www.google.com/maps/embed?pb=!1m64!1m12!1m3!1d251125.70070911525!2d-61.68178347551487!3d10.434341829069302!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m49!3e0!4m5!1s0x8c3607d0be7ebb55%3A0x2dd4764afb66c4d6!2sThe%20BRIX%2C%20Autograph%20Collection%2C%20Coblentz%20Avenue%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6730318!2d-61.5088929!4m5!1s0x8c35f97bc8e11f6b%3A0xc2c1d38701422f0c!2sChaguanas%2C%20Trinidad%20and%20Tobago!3m2!1d10.5168387!2d-61.4114482!4m5!1s0x8c35f0a801687fd5%3A0xdd0868fb2583c6ac!2sDattatreya%20Mandir%20Temple%2C%20Carapichaima%2C%20Trinidad%20and%20Tobago!3m2!1d10.4755332!2d-61.4315836!4m5!1s0x8c35fa82f493588f%3A0x401667f802b5070!2sSewdass%20Sadhu%20Shiva%20Mandir%20Temple%20in%20the%20Sea%2C%20Temple%2C%20Waterloo%2C%20Trinidad%20and%20Tobago!3m2!1d10.4816922!2d-61.4755472!4m5!1s0x8c358cfa3a951f7d%3A0x1c04ab58c8064b46!2sSan%20Fernando%20Hill%2C%20San%20Fernando%2C%20Trinidad%20and%20Tobago!3m2!1d10.2817507!2d-61.45616!4m5!1s0x8c3596bf9b282857%3A0x8a62a02a86b7e912!2sPitch%20Lake%2C%20New%20Jersey%2C%20Trinidad%20and%20Tobago!3m2!1d10.2325!2d-61.628056!4m5!1s0x8c35fc5028084c8d%3A0x4b88dab8a7a90142!2sCaroni%20Swamp%2C%20Trinidad%20and%20Tobago!3m2!1d10.5913889!2d-61.4552778!4m5!1s0x8c3607d0be7ebb55%3A0x2dd4764afb66c4d6!2sThe%20BRIX%2C%20Autograph%20Collection%2C%20Coblentz%20Avenue%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6730318!2d-61.5088929!5e0!3m2!1sen!2sus!4v1754155418943!5m2!1sen!2sus",
  ],
  "trinidad-and-tobago/5": [
    "https://www.google.com/maps/embed?pb=!1m40!1m12!1m3!1d62602.293107024634!2d-60.69761350489427!3d11.287608406702049!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m25!3e0!4m5!1s0x8c4853e8fedee33d%3A0x1ef432cfd6352f48!2sCastara%20Bay%20Rd%2C%20Trinidad%20and%20Tobago!3m2!1d11.279954!2d-60.6950764!4m5!1s0x8c4853e87af0512b%3A0x9bb0b51268c22197!2sCastara%20Beach!3m2!1d11.279833!2d-60.695929899999996!4m5!1s0x8c485154b47f626b%3A0x26ea8ba399baf10a!2sEnglishmans%20Bay%2C%20Trinidad%20and%20Tobago!3m2!1d11.2918583!2d-60.6727874!4m5!1s0x8c4855caafa4f21b%3A0xf07a1bfe142e60ad!2sTobago%20Main%20Ridge%20Forest%20Reserve%2C%20Mason%20Hall%2C%20Trinidad%20and%20Tobago!3m2!1d11.2737713!2d-60.6168974!5e0!3m2!1sen!2sus!4v1754186428058!5m2!1sen!2sus",
  ],
  "trinidad-and-tobago/6": [
    "https://www.google.com/maps/embed?pb=!1m46!1m12!1m3!1d15657.059913678198!2d-60.84242305277283!3d11.168005974087151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m31!3e0!4m5!1s0x8c49b3e87f71c9af%3A0x1632d2b72b7ec267!2sStore%20Bay%20Beach%2C%20Crown%20Point%2C%20Trinidad%20and%20Tobago!3m2!1d11.1559032!2d-60.839817499999995!4m5!1s0x8c49b3962521cfbf%3A0x736df3b46cfd0921!2sPigeon%20Point%20Beach%2C%20Trinidad%20and%20Tobago!3m2!1d11.1729402!2d-60.8382219!4m5!1s0x8c49b3005e884753%3A0x3237529e00e7259b!2sNylon%20Pool%2C%20Pigeon%20Point%20Road%2C%20Bon%20Accord%2C%20Trinidad%20and%20Tobago!3m2!1d11.1647213!2d-60.840097799999995!4m5!1s0x8c49b3a169f6af53%3A0x16f361e956f4218b!2sBuccoo%20Reef%2C%20Trinidad%20and%20Tobago!3m2!1d11.1822328!2d-60.8310901!4m5!1s0x8c49b3b761df1489%3A0x52f6ef57d1c9b49f!2sNo%20Man%E2%80%99s%20Land%2C%20Bon%20Accord%2C%20Trinidad%20and%20Tobago!3m2!1d11.168677299999999!2d-60.8250007!5e0!3m2!1sen!2sus!4v1754233605541!5m2!1sen!2sus",
  ],
  // v1's CT/1 declares a Plymouth MA itinerary but its content[] never
  // renders it. The seed skips orphaned itineraries, so this URL is
  // unused — kept only for completeness.
  "united-states-connecticut/1": [
    "https://www.google.com/maps/embed?pb=!1m64!1m12!1m3!1d23738.949656133063!2d-70.66618172767274!3d41.94941490894363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m49!3e0!4m5!1s0x89e4bae73892b4ab%3A0xba3eed0190bd4b74!2sPilgrim%20Memorial%20State%20Park%2C%2079%20Water%20St%2C%20Plymouth%2C%20MA%2002360!3m2!1d41.958966!2d-70.662252!4m5!1s0x89e4bb177d3b91c5%3A0x48904cb0a3c9c782!2sFishmans%20Memorial%20Park%2C%20120%20Water%20St%2C%20Plymouth%2C%20MA%2002360!3m2!1d41.9607344!2d-70.6663907!4m5!1s0x89e4baddf5a6d0e5%3A0x4ea307a42b936531!2sMayflower%20II%2C%20Water%20Street%2C%20Plymouth%2C%20MA!3m2!1d41.9598064!2d-70.6621394!4m5!1s0x89e4bae723353103%3A0xa8e104ec582dd9ee!2sPlymouth%20Rock%2C%20Water%20Street%2C%20Plymouth%2C%20MA!3m2!1d41.9580674!2d-70.6621376!4m5!1s0x89e4bae1593744f7%3A0x53ab7054bd3c2e1c!2sFirst%20Parish%20in%20Plymouth%2C%20Church%20Street%2C%20Plymouth%2C%20MA!3m2!1d41.9550015!2d-70.6654217!4m5!1s0x89e4bae308301d27%3A0x3b83655f86602dac!2sPlimoth%20Grist%20Mill%2C%20Spring%20Lane%2C%20Plymouth%2C%20MA!3m2!1d41.9535604!2d-70.6652416!4m5!1s0x89e4bae129555555%3A0xb9d26af5e7b83c2f!2sPlymouth%20Village%20Historic%20District%2C%20Middle%20St%2C%20Plymouth%2C%20MA%2002360!3m2!1d41.9574718!2d-70.6636893!4m5!1s0x89e4ba829c616caf%3A0xdf1c5a6e1b55868f!2sPlimoth%20Patuxent%20Museums%2C%20Warren%20Avenue%2C%20Plymouth%2C%20MA!3m2!1d41.938099099999995!2d-70.6253663!5e0!3m2!1sen!2sus!4v1752353213936!5m2!1sen!2sus",
  ],
  "united-states-massachusetts/1": [
    "https://www.google.com/maps/embed?pb=!1m64!1m12!1m3!1d23738.949656133063!2d-70.66618172767274!3d41.94941490894363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m49!3e0!4m5!1s0x89e4bae73892b4ab%3A0xba3eed0190bd4b74!2sPilgrim%20Memorial%20State%20Park%2C%2079%20Water%20St%2C%20Plymouth%2C%20MA%2002360!3m2!1d41.958966!2d-70.662252!4m5!1s0x89e4bb177d3b91c5%3A0x48904cb0a3c9c782!2sFishmans%20Memorial%20Park%2C%20120%20Water%20St%2C%20Plymouth%2C%20MA%2002360!3m2!1d41.9607344!2d-70.6663907!4m5!1s0x89e4baddf5a6d0e5%3A0x4ea307a42b936531!2sMayflower%20II%2C%20Water%20Street%2C%20Plymouth%2C%20MA!3m2!1d41.9598064!2d-70.6621394!4m5!1s0x89e4bae723353103%3A0xa8e104ec582dd9ee!2sPlymouth%20Rock%2C%20Water%20Street%2C%20Plymouth%2C%20MA!3m2!1d41.9580674!2d-70.6621376!4m5!1s0x89e4bae1593744f7%3A0x53ab7054bd3c2e1c!2sFirst%20Parish%20in%20Plymouth%2C%20Church%20Street%2C%20Plymouth%2C%20MA!3m2!1d41.9550015!2d-70.6654217!4m5!1s0x89e4bae308301d27%3A0x3b83655f86602dac!2sPlimoth%20Grist%20Mill%2C%20Spring%20Lane%2C%20Plymouth%2C%20MA!3m2!1d41.9535604!2d-70.6652416!4m5!1s0x89e4bae129555555%3A0xb9d26af5e7b83c2f!2sPlymouth%20Village%20Historic%20District%2C%20Middle%20St%2C%20Plymouth%2C%20MA%2002360!3m2!1d41.9574718!2d-70.6636893!4m5!1s0x89e4ba829c616caf%3A0xdf1c5a6e1b55868f!2sPlimoth%20Patuxet%20Museums%2C%20Warren%20Avenue%2C%20Plymouth%2C%20MA!3m2!1d41.938099099999995!2d-70.6253663!5e0!3m2!1sen!2sus!4v1752353213936!5m2!1sen!2sus",
  ],
  "united-states-rhode-island/1": [
    "https://www.google.com/maps/embed?pb=!1m70!1m12!1m3!1d11892.474399397393!2d-71.42466018584844!3d41.82574423995734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m55!3e0!4m5!1s0x89e4451a576adb33%3A0x4e520f7525043b6d!2sRhode%20Island%20State%20House%2C%2082%20Smith%20St%2C%20Providence%2C%20RI%2002903!3m2!1d41.8307662!2d-71.4153037!4m5!1s0x89e44561d263f5df%3A0xb6db537995a8ed00!2sStation%20Park%2C%20Francis%20Street%2C%20Providence%2C%20RI!3m2!1d41.828679!2d-71.4144681!4m5!1s0x89e44510e1520037%3A0x622cd3cfc6974b20!2sWaterplace%20Park%2C%20Memorial%20Boulevard%2C%20Providence%2C%20RI!3m2!1d41.8274486!2d-71.4139414!4m5!1s0x89e44516a9e45fbd%3A0x775bd7cd62b056db!2sCity%20Center%2FPVD%20Rink%2C%20Kennedy%20Plaza%2C%20Providence%2C%20RI!3m2!1d41.8247174!2d-71.412699!4m5!1s0x89e445f52d38b965%3A0x2aaf090b4267b9a1!2sIndependence%20Trail%2C%20Weybosset%20Street%2C%20Providence%2C%20RI!3m2!1d41.8241344!2d-71.4096587!4m5!1s0x89e445128c461b3d%3A0x579937acaabea29f!2sTrinity%20Brewhouse%2C%20Fountain%20Street%2C%20Providence%2C%20RI!3m2!1d41.8223797!2d-71.4167566!4m5!1s0x89e4452490b38e29%3A0xb7e69fcf7a220cb!2sBrown%20University%2C%20Providence%2C%20RI!3m2!1d41.826771799999996!2d-71.4025482!4m5!1s0x89e44523720b327b%3A0x3e3fcdc8a8c57a21!2sCollege%20Hill%2C%20Providence%2C%20RI!3m2!1d41.830156699999996!2d-71.4032189!4m5!1s0x89e445750dc608fb%3A0x38113e9694689256!2sFederal%20Hill%2C%20Providence%2C%20RI!3m2!1d41.8198338!2d-71.4293903!5e0!3m2!1sen!2sus!4v1752421099391!5m2!1sen!2sus",
  ],
};

// ---------------------------------------------------------------------------
// Tips sections
// ---------------------------------------------------------------------------

type TipSectionKey =
  | "essential_tips"
  | "budget_planning"
  | "food_dining"
  | "transportation"
  | "accommodation"
  | "safety_health";

const TIP_SECTION_KEY_BY_CAMEL: Record<string, TipSectionKey> = {
  essentialTips: "essential_tips",
  budgetPlanning: "budget_planning",
  foodDining: "food_dining",
  transportation: "transportation",
  accommodation: "accommodation",
  safetyHealth: "safety_health",
};

const TIP_SECTION_ORDER = [
  "essentialTips",
  "budgetPlanning",
  "foodDining",
  "transportation",
  "accommodation",
  "safetyHealth",
] as const;

type V1TipsContent = {
  tip: {
    country: string;
    country_code: string;
    state: string | null;
    path: string;
    title: string;
    description?: string;
  };
  content: Record<
    string,
    string | { content: string; enabled: boolean } | null | undefined
  >;
};

async function loadV1Tips(slug: string): Promise<V1TipsContent> {
  const filePath = path.join(V1_DATA_DIR, "tipsContent", `${slug}.json`);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as V1TipsContent;
}

// ---------------------------------------------------------------------------
// Gallery (fallback list — Cloudinary resource-list endpoint is not reachable
// from this environment, same network path as the Supabase host. When
// running in a network that can reach Cloudinary, this list can be swapped
// for the live API response.)
// ---------------------------------------------------------------------------

const GALLERY_FOLDER = "aroundtheworld50s/homePageGallery";
const GALLERY_FALLBACK_NAMES = [
  "20171226_102228_Original",
  "20180402_131039_Original",
  "IMG_0145",
  "IMG_1361",
  "IMG_9775",
];

// ---------------------------------------------------------------------------
// SQL serialization — convert Drizzle insert row objects to SQL literals
// ---------------------------------------------------------------------------

type SqlRow = Record<string, unknown>;

/**
 * Escape a JavaScript value as a Postgres literal. Uses the E'' escape
 * string form so backslashes and newlines inside HTML content are preserved
 * verbatim without surprising the Postgres parser.
 */
function sqlLiteral(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error(`non-finite number: ${value}`);
    return String(value);
  }
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (value instanceof Date) {
    return `'${value.toISOString()}'::timestamptz`;
  }
  if (typeof value === "object") {
    // jsonb payload — stringify and dollar-quote to preserve literal content.
    const json = JSON.stringify(value);
    return `${dollarQuote(json)}::jsonb`;
  }
  if (typeof value === "string") {
    return dollarQuote(value);
  }
  throw new Error(`Unsupported SQL literal type: ${typeof value}`);
}

/**
 * Wrap a string in Postgres dollar-quoting. Dollar quoting avoids every
 * escape-sequence gotcha in regular string literals — backslashes, single
 * quotes, CR/LF, emoji, and HTML content all pass through untouched. The
 * tag is regenerated if it ever collides with the content, which is
 * effectively impossible for these inputs but handled anyway.
 */
function dollarQuote(str: string): string {
  let tag = "s";
  while (str.includes(`$${tag}$`)) tag += "x";
  return `$${tag}$${str}$${tag}$`;
}

/**
 * Serialize a single-row insert. Columns are taken from the row object's
 * own keys — caller is responsible for using snake_case column names.
 */
function insertRow(table: string, row: SqlRow): string {
  const columns = Object.keys(row);
  const values = columns.map((c) => sqlLiteral(row[c])).join(", ");
  const quotedCols = columns.map((c) => `"${c}"`).join(", ");
  return `INSERT INTO "${table}" (${quotedCols}) VALUES (${values});`;
}

/**
 * Serialize a multi-row insert. All rows must share the same keys in the
 * same order — the first row's keys are the canonical column list.
 */
function insertRows(table: string, rows: SqlRow[]): string {
  if (rows.length === 0) return "";
  const columns = Object.keys(rows[0]);
  const quotedCols = columns.map((c) => `"${c}"`).join(", ");
  const valueTuples = rows
    .map(
      (row) =>
        `  (${columns.map((c) => sqlLiteral(row[c])).join(", ")})`,
    )
    .join(",\n");
  return `INSERT INTO "${table}" (${quotedCols}) VALUES\n${valueTuples};`;
}

// ---------------------------------------------------------------------------
// Drizzle type → snake_case SQL row converters.
//
// Drizzle's $inferInsert gives us TS safety on what fields exist, but its
// JS keys are camelCase while the column names are snake_case. These tiny
// mappers are the only place column names appear — if the schema renames a
// column, typecheck will catch every call site via the Required<...> types
// below.
// ---------------------------------------------------------------------------

function blogPostRow(row: Required<Pick<NewBlogPost, "id">> & NewBlogPost): SqlRow {
  return {
    id: row.id,
    country_slug: row.countrySlug,
    post_index: row.postIndex,
    country: row.country,
    country_code: row.countryCode,
    state: row.state ?? null,
    title: row.title,
    subtitle: row.subtitle ?? null,
    header: row.header ?? null,
    description: row.description ?? null,
    excerpt: row.excerpt ?? null,
    background_image: row.backgroundImage ?? null,
    tips_cta_copy: row.tipsCtaCopy ?? null,
    tips_slug: row.tipsSlug ?? null,
    status: row.status ?? "draft",
    published_at: row.publishedAt ?? null,
    created_at: row.createdAt ?? null,
  };
}

function blogItineraryRow(
  row: Required<Pick<NewBlogItinerary, "id" | "postId" | "position" | "title">> &
    NewBlogItinerary,
): SqlRow {
  return {
    id: row.id,
    post_id: row.postId,
    position: row.position,
    title: row.title,
    map_embed_url: row.mapEmbedUrl ?? null,
  };
}

function blogItineraryItemRow(
  row: Required<
    Pick<NewBlogItineraryItem, "itineraryId" | "position" | "content">
  > &
    NewBlogItineraryItem,
): SqlRow {
  return {
    itinerary_id: row.itineraryId,
    position: row.position,
    content: row.content,
  };
}

function blogBlockRow(
  row: Required<Pick<NewBlogBlock, "postId" | "position" | "type" | "data">> &
    NewBlogBlock,
): SqlRow {
  return {
    post_id: row.postId,
    position: row.position,
    type: row.type,
    data: row.data,
  };
}

function tipRow(row: Required<Pick<NewTip, "id">> & NewTip): SqlRow {
  return {
    id: row.id,
    slug: row.slug,
    country: row.country,
    country_code: row.countryCode,
    state: row.state ?? null,
    title: row.title,
    description: row.description ?? null,
    status: row.status ?? "draft",
    published_at: row.publishedAt ?? null,
  };
}

function tipSectionRow(
  row: Required<
    Pick<NewTipSection, "tipId" | "sectionKey" | "position" | "enabled">
  > &
    NewTipSection,
): SqlRow {
  return {
    tip_id: row.tipId,
    section_key: row.sectionKey,
    content: row.content ?? null,
    enabled: row.enabled,
    position: row.position,
  };
}

function galleryImageRow(
  row: Required<Pick<NewGalleryImage, "cloudinaryPublicId" | "position">> &
    NewGalleryImage,
): SqlRow {
  return {
    cloudinary_public_id: row.cloudinaryPublicId,
    position: row.position,
  };
}

// ---------------------------------------------------------------------------
// Section → block mapping
// ---------------------------------------------------------------------------

type InsertBlockArgs = {
  postId: string;
  section: V1Section;
  folder: string;
  position: number;
  itineraryIdByMapIndex: Map<number, string>;
};

function toBlockRow(args: InsertBlockArgs): NewBlogBlock | null {
  const { postId, section, folder, position, itineraryIdByMapIndex } = args;

  switch (section.layout.type) {
    case "text":
      return {
        postId,
        position,
        type: "text",
        data: { html: rewriteInternalLinks(section.content) },
      };

    case "two-column": {
      const leftType = section.layout.leftType ?? "text";
      const rightType = section.layout.rightType ?? "text";
      const leftImage = section.leftImage
        ? toBlogImagePublicId(folder, section.leftImage)
        : undefined;
      const rightImage = section.rightImage
        ? toBlogImagePublicId(folder, section.rightImage)
        : undefined;
      const { leftImageAlt, rightImageAlt } = splitImageAlt(section.layout);

      return {
        postId,
        position,
        type: "two_column",
        data: {
          leftType,
          rightType,
          ...(leftImage ? { leftImage } : {}),
          ...(rightImage ? { rightImage } : {}),
          ...(leftImageAlt ? { leftImageAlt } : {}),
          ...(rightImageAlt ? { rightImageAlt } : {}),
          html: rewriteInternalLinks(section.content),
        },
      };
    }

    case "image-grid":
      return {
        postId,
        position,
        type: "image_grid",
        data: {
          images: (section.images ?? []).map((f) =>
            toBlogImagePublicId(folder, f),
          ),
        },
      };

    case "itinerary-with-map": {
      const mapIndex = section.layout.mapIndex ?? 0;
      const itineraryId = itineraryIdByMapIndex.get(mapIndex);
      if (!itineraryId) {
        throw new Error(
          `Block references mapIndex ${mapIndex} in ${folder} but no itinerary was inserted for it`,
        );
      }
      return {
        postId,
        position,
        type: "itinerary_with_map",
        data: { itineraryId },
      };
    }

    case "instagram":
      // `instagram` is not in v2's block type enum yet — skip.
      return null;

    default:
      throw new Error(
        `Unknown v1 layout type "${(section.layout as { type: string }).type}" in ${folder}`,
      );
  }
}

// ---------------------------------------------------------------------------
// Seed orchestration
// ---------------------------------------------------------------------------

type SqlChunk = { name: string; sql: string };

async function build(): Promise<{ full: string; chunks: SqlChunk[] }> {
  const statements: string[] = [];
  const chunks: SqlChunk[] = [];
  const pushChunk = (name: string, lines: string[]) => {
    chunks.push({ name, sql: lines.join("\n") + "\n" });
  };

  statements.push("-- Generated by v2/scripts/seed.ts — do not edit by hand.");
  statements.push("-- Apply via Supabase MCP execute_sql.");
  statements.push("BEGIN;");
  statements.push("");
  statements.push("-- Wipe seeded tables. Cascading FKs handle children,");
  statements.push("-- but we touch every table so the behavior is obvious.");
  statements.push(`DELETE FROM "gallery_images";`);
  statements.push(`DELETE FROM "blog_blocks";`);
  statements.push(`DELETE FROM "blog_itinerary_items";`);
  statements.push(`DELETE FROM "blog_itineraries";`);
  statements.push(`DELETE FROM "blog_posts";`);
  statements.push(`DELETE FROM "tip_sections";`);
  statements.push(`DELETE FROM "tips";`);
  statements.push("");

  pushChunk("00_wipe", [
    "-- Chunk: wipe seeded tables before re-inserting.",
    `DELETE FROM "gallery_images";`,
    `DELETE FROM "blog_blocks";`,
    `DELETE FROM "blog_itinerary_items";`,
    `DELETE FROM "blog_itineraries";`,
    `DELETE FROM "blog_posts";`,
    `DELETE FROM "tip_sections";`,
    `DELETE FROM "tips";`,
  ]);

  // --- Blog posts -----------------------------------------------------------
  const metas = await loadV1BlogMetas();
  statements.push(`-- ${metas.length} blog posts`);

  for (const meta of metas) {
    const [countrySlug, postIndexStr] = meta.folder.split("/");
    const postIndex = Number(postIndexStr);
    if (!countrySlug || Number.isNaN(postIndex)) {
      throw new Error(`Invalid folder shape "${meta.folder}"`);
    }

    const v1Content = await loadV1BlogContent(meta.folder);
    const publishedAt = new Date(`${meta.createdAt}T00:00:00Z`);
    const postId = randomUUID();

    const post: NewBlogPost & { id: string } = {
      id: postId,
      countrySlug,
      postIndex,
      country: meta.country,
      countryCode: meta.countryCode,
      state: meta.state ?? null,
      title: meta.title,
      subtitle: v1Content.subtitle ?? null,
      header: v1Content.header ?? null,
      description: v1Content.description
        ? rewriteInternalLinks(v1Content.description)
        : null,
      excerpt: meta.excerpt ?? null,
      backgroundImage: meta.backgroundImage
        ? toBlogImagePublicId(meta.folder, meta.backgroundImage)
        : null,
      tipsCtaCopy: v1Content.tipsSection?.trim()
        ? rewriteInternalLinks(v1Content.tipsSection)
        : null,
      tipsSlug: tipsLinkToSlug(v1Content.tipsLink),
      status: "published",
      publishedAt,
      createdAt: publishedAt,
    };

    const postChunkLines: string[] = [];
    postChunkLines.push(`-- Chunk: ${meta.folder}`);
    postChunkLines.push(insertRow("blog_posts", blogPostRow(post)));

    statements.push(`-- ${meta.folder}`);
    statements.push(insertRow("blog_posts", blogPostRow(post)));

    // Only insert itineraries actually referenced by a block. v1's CT/1
    // has an orphan Plymouth MA itinerary that no block renders — skip it
    // so the seed state matches what readers saw in v1.
    const referencedMapIndices = new Set<number>();
    for (const section of v1Content.content) {
      if (section.layout.type === "itinerary-with-map") {
        referencedMapIndices.add(section.layout.mapIndex ?? 0);
      }
    }

    const itineraryIdByMapIndex = new Map<number, string>();
    const postMapUrls = MAP_URLS_BY_POST[meta.folder] ?? [];
    const itineraryRows: SqlRow[] = [];
    const itineraryItemRows: SqlRow[] = [];

    for (const mapIndex of [...referencedMapIndices].sort((a, b) => a - b)) {
      const v1Itinerary = v1Content.itineraries[mapIndex];
      if (!v1Itinerary) {
        throw new Error(
          `Block references mapIndex ${mapIndex} in ${meta.folder} but itineraries[${mapIndex}] is missing`,
        );
      }
      const itineraryId = randomUUID();
      itineraryIdByMapIndex.set(mapIndex, itineraryId);

      itineraryRows.push(
        blogItineraryRow({
          id: itineraryId,
          postId,
          position: mapIndex,
          title: v1Itinerary.title,
          mapEmbedUrl: postMapUrls[mapIndex] ?? null,
        }),
      );

      v1Itinerary.items.forEach((content, index) => {
        itineraryItemRows.push(
          blogItineraryItemRow({
            itineraryId,
            position: index,
            content,
          }),
        );
      });
    }

    if (itineraryRows.length > 0) {
      statements.push(insertRows("blog_itineraries", itineraryRows));
      postChunkLines.push(insertRows("blog_itineraries", itineraryRows));
    }
    if (itineraryItemRows.length > 0) {
      statements.push(insertRows("blog_itinerary_items", itineraryItemRows));
      postChunkLines.push(insertRows("blog_itinerary_items", itineraryItemRows));
    }

    // Blocks — skip instagram sections (not in v2 enum yet).
    let blockPosition = 0;
    const blockRows: SqlRow[] = [];
    for (const section of v1Content.content) {
      const block = toBlockRow({
        postId,
        section,
        folder: meta.folder,
        position: blockPosition,
        itineraryIdByMapIndex,
      });
      if (!block) continue;
      blockRows.push(blogBlockRow(block));
      blockPosition += 1;
    }
    if (blockRows.length > 0) {
      statements.push(insertRows("blog_blocks", blockRows));
      postChunkLines.push(insertRows("blog_blocks", blockRows));
    }
    statements.push("");

    const chunkName = `post_${meta.folder.replace("/", "_")}`;
    pushChunk(chunkName, postChunkLines);

    console.log(
      `[seed] ${meta.folder} → ${blockRows.length} blocks, ${itineraryRows.length} itineraries`,
    );
  }

  // --- Tips -----------------------------------------------------------------
  const tipsSlugs = [
    "trinidad-and-tobago",
    "united-states-massachusetts",
    "united-states-new-york",
  ];
  statements.push(`-- ${tipsSlugs.length} tips pages`);
  const tipsChunkLines: string[] = ["-- Chunk: tips + tip_sections"];

  const seedNow = new Date();

  for (const slug of tipsSlugs) {
    const v1 = await loadV1Tips(slug);
    const tipId = randomUUID();

    const tip: NewTip & { id: string } = {
      id: tipId,
      slug: v1.tip.path,
      country: v1.tip.country,
      countryCode: v1.tip.country_code,
      state: v1.tip.state ?? null,
      title: v1.tip.title,
      description: v1.tip.description ?? null,
      status: "published",
      publishedAt: seedNow,
    };

    statements.push(`-- tips/${slug}`);
    statements.push(insertRow("tips", tipRow(tip)));
    tipsChunkLines.push(`-- tips/${slug}`);
    tipsChunkLines.push(insertRow("tips", tipRow(tip)));

    const sectionRows: SqlRow[] = TIP_SECTION_ORDER.map((camelKey, position) => {
      const raw = v1.content[camelKey];
      const content =
        typeof raw === "string"
          ? raw
          : typeof raw === "object" && raw !== null
            ? (raw.content ?? "")
            : "";
      const enabled =
        typeof raw === "string"
          ? true
          : typeof raw === "object" && raw !== null
            ? (raw.enabled ?? true)
            : true;

      return tipSectionRow({
        tipId,
        sectionKey: TIP_SECTION_KEY_BY_CAMEL[camelKey],
        content: content ? rewriteInternalLinks(content) : null,
        enabled,
        position,
      });
    });

    statements.push(insertRows("tip_sections", sectionRows));
    statements.push("");
    tipsChunkLines.push(insertRows("tip_sections", sectionRows));
    console.log(`[seed] tips/${slug} → ${sectionRows.length} sections`);
  }
  pushChunk("tips", tipsChunkLines);

  // --- Gallery --------------------------------------------------------------
  const galleryPublicIds = GALLERY_FALLBACK_NAMES.map(
    (n) => `${GALLERY_FOLDER}/${n}`,
  );
  const galleryInsert = insertRows(
    "gallery_images",
    galleryPublicIds.map((publicId, index) =>
      galleryImageRow({ cloudinaryPublicId: publicId, position: index }),
    ),
  );
  statements.push(`-- ${galleryPublicIds.length} gallery images`);
  statements.push(galleryInsert);
  statements.push("");

  pushChunk("gallery", ["-- Chunk: gallery", galleryInsert]);

  statements.push("COMMIT;");
  statements.push("");

  console.log(`[seed] ${galleryPublicIds.length} gallery images`);

  return { full: statements.join("\n"), chunks };
}

async function main() {
  const { full, chunks } = await build();
  await fs.writeFile(OUTPUT_SQL, full, "utf8");
  const lineCount = full.split("\n").length;
  const byteCount = Buffer.byteLength(full, "utf8");
  console.log(
    `[seed] wrote ${OUTPUT_SQL} (${lineCount} lines, ${byteCount.toLocaleString()} bytes)`,
  );

  // Fresh chunk directory so stale files from a previous run don't linger.
  await fs.rm(OUTPUT_CHUNKS_DIR, { recursive: true, force: true });
  await fs.mkdir(OUTPUT_CHUNKS_DIR, { recursive: true });
  await Promise.all(
    chunks.map((chunk, index) =>
      fs.writeFile(
        path.join(
          OUTPUT_CHUNKS_DIR,
          `${String(index).padStart(2, "0")}_${chunk.name}.sql`,
        ),
        chunk.sql,
        "utf8",
      ),
    ),
  );
  console.log(
    `[seed] wrote ${chunks.length} chunk files to ${OUTPUT_CHUNKS_DIR}`,
  );
  console.log(
    "[seed] apply via Supabase MCP execute_sql (the direct DB host is not reachable from this network).",
  );
}

main().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
