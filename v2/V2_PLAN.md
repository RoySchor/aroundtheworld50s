# v2 Build Plan

Senior engineering review and implementation roadmap for the Next.js 16 rewrite of aroundtheworld50s.

Last updated: 2026-04-13

---

## 1. Where We Are

v2 has **infrastructure and data modeling done, zero application code**. Specifically:

**Done and solid:**
- Next.js 16 + React 19 scaffold with App Router
- Drizzle ORM schema: 8 tables, 4 enums, CHECK constraints, JSONB with type safety, cascading deletes
- Migration 0000 with hand-maintained post-init: `set_updated_at()` trigger with IS DISTINCT FROM guard, 8 BEFORE UPDATE triggers, 5 DEFERRABLE position uniques, RLS enabled on all tables
- Supabase client setup: browser client, server client (cookies), middleware session refresh
- Zod-validated environment variables (client + server split, `server-only` import guard)
- Drizzle DB client with schema import for relational queries, HMR-safe `globalThis` singleton, `max: 1` for serverless
- Tailwind v4, ESLint 9, Prettier, TypeScript strict mode

**Not done:**
- Static pages + destinations/WorldMap (Phase 1.8)
- SEO metadata, sitemap, JSON-LD (Phase 1.9)
- Auth + admin CRUD (Phase 2)
- Vercel deployment, polish, v1 sunset (Phase 3)

---

## 2. v1 Audit: Can v2's Schema Represent Every Post Without Data Loss?

We audited all 12 v1 blog posts, 3 tips pages, the gallery, and every Python script output. Summary:

**The schema handles all v1 data shapes.** No structural gaps. Specifics:

| v1 Feature | Schema Coverage |
|---|---|
| 5 block types (text, two-column, image-grid, itinerary-with-map, instagram) | 4 of 5 in `blog_block_type` enum. Instagram intentionally deferred — one-line `ALTER TYPE ADD VALUE` when ready. |
| Multiple itineraries per post (Post 1 has 2) | `blog_itineraries` allows N rows per post. `itinerary_with_map` block references by UUID. |
| Posts with zero itineraries (NY1, NY2, NY3) | Itineraries are optional child rows — no issue. |
| Google Maps embed URLs (9 declared, 8 rendered) | `blog_itineraries.map_embed_url` — nullable text. |
| `two-column` with optional `imageAlt` (missing on Posts 3, 8) | `leftImageAlt`/`rightImageAlt` are optional in the JSONB payload. |
| Posts with no tips CTA (NY2, NY3, RI — empty string `""`) | `blog_posts.tips_cta_copy` and `tips_slug` are nullable. Seed stores `null`, not `""`. |
| Image filename edge cases: spaces (`IMG_1867 2.jpeg`), mixed extensions (`.jpg`, `.JPG`, `.jpeg`) | All stored as `text` — no normalization needed. Cloudinary URL builder handles encoding. |
| Duplicate image in a grid (NY1: `IMG_0487.jpeg` twice) | `images: string[]` in JSONB — duplicates are valid array entries. |
| Orphaned itinerary+map data (CT/1 references Plymouth MA) | Seed script skips — no content block references it. |
| Tips with 6 named sections, enable/disable, HTML content | `tip_sections` with `section_key` enum, `content`, `enabled`, `position`. |
| Gallery images with explicit ordering | `gallery_images` with `position` unique. |

**Seed script edge cases to handle** (not schema issues):
- Map embed URLs live in `.tsx` files (JSX), not `.constants.ts`. Hardcode the 8 URLs in the seed script — they're static historical data.
- `tipsLink` values like `/aroundtheworld50s#/tips/trinidad-and-tobago` need to be stripped to just `trinidad-and-tobago` for `blog_posts.tips_slug`.
- v1's single `imageAlt` maps to `leftImageAlt` or `rightImageAlt` depending on which side has the image.
- Internal HTML links (`href="/aroundtheworld50s#/tips/..."`) must be rewritten to v2 paths (`href="/tips/..."`) during seed. Broken internal links are worse than a slightly longer seed script.
- Blog content HTML uses CSS classes like `post-link` that must exist in v2's styles or links lose styling.

---

## 3. v1 Feature Inventory and Gap Analysis

### Content features

| v1 Feature | v1 Implementation | v2 Plan |
|---|---|---|
| Blog post display | Hardcoded TSX per post | Dynamic pages from DB |
| Blog listing (all) | Static array from `blogs.js` | DB query, sorted by `published_at` desc (with `created_at` as secondary tiebreaker) |
| Blog country listing + hero | Full-screen parallax hero (first post's bg image + country overlay) + filtered grid | DB query + hero component using first post's `background_image` |
| Blog blocks: text | `dangerouslySetInnerHTML` | Server-side sanitized HTML render |
| Blog blocks: two-column | `TwoColumnLayout` + `ContentPane` | Port component |
| Blog blocks: image-grid | `ImageGrid` with Cloudinary URLs | Port component |
| Blog blocks: itinerary-with-map | `TwoColumnLayout` + `MapEmbed` | Port component, UUID ref replaces fragile mapIndex |
| Blog blocks: instagram | Broken embed, fallback link | Deferred. `ALTER TYPE ADD VALUE` when fixed. |
| Tips listing + country flags | Grid with `react-world-flags` flags per card | Port with `react-world-flags` dependency |
| Tips detail | Dynamic JSON import, 6 named sections | DB query with sections |
| Tips "not found" state | Specific "tips page for '{location}' doesn't exist yet" message | `not-found.tsx` per route with this copy — not a generic 404 |
| Tips empty-section placeholder | "This page will be automatically populated..." text | Preserve — render when `content` is null/empty and `enabled` is true |
| Gallery slider | Auto-advance (5s interval), "1-3 / 15" counter | Port auto-advance behavior + position counter |
| Destinations page | WorldMap + dropdown `<select>` navigator | Port both components |
| WorldMap hover interaction | Invisible hit areas, flag-pole CSS animation, preview card with bg image, click → blog section. 30+ aspirational coordinates for countries with zero posts. | Port as full component. Aspirational coordinates stay as a static constants file (`lib/constants/worldMapCoordinates.ts`) — they're editorial intent, not derivable from DB data. |

### Infrastructure features

| v1 Feature | v1 Implementation | v2 Plan |
|---|---|---|
| Routing | HashRouter (`/#/blog/...`) | App Router (`/blog/...`) — real URLs |
| Navbar | Transparent on hero pages, ADMIN link visible to everyone | Port transparency logic. Admin link: hidden for unauthenticated users — show only when logged in as admin. No security-through-obscurity. |
| Contact form | EmailJS (client-side) | Keep EmailJS — zero backend, already working, avoids email delivery infra |
| Error page | Static GIF from Cloudinary | `not-found.tsx` + `error.tsx` |
| Auth | `sessionStorage` + env password hash | Supabase Auth + profiles table. Login page, profile trigger, RLS policies. |
| Social links | Instagram + TikTok icons in navbar | Port — static constants |
| Country flags | `react-world-flags` on tips cards + worldmap hover | Add `react-world-flags` as v2 dependency |
| Fonts | 8 custom fonts via @fontsource | Audit usage first — see open questions |
| SEO | None | Per-page metadata, OG tags, sitemap.xml, JSON-LD |
| Analytics | None | Vercel Analytics (zero-config, good enough for ~100 readers) |

### Admin features (the core reason for v2)

| v1 Feature | v1 Implementation | v2 Plan |
|---|---|---|
| Blog creation | Admin form → JSON ZIP → Python script → code gen → git deploy | Admin form → server action → DB insert |
| Blog preview | Live preview in admin UI | Preview component reusing blog renderer |
| Tips editing | Rich text editor → Python script → JSON file | Admin form → server action → DB upsert |
| Gallery management | Admin UI → terminal command → Python script | Admin UI → server action → DB + Cloudinary |
| Image upload | Python script → Cloudinary API | Server action → Cloudinary upload API |
| Content deploy | Python commit + push + `npm run deploy` | Eliminated — DB writes are instant, `revalidatePath()` regenerates the page |

### What v2 eliminates

These v1 mechanisms are replaced and should NOT be ported:
- `src/data/blogs.js` (static blog metadata array) → `blog_posts` table
- `src/data/tips.js` + `src/data/tipsContent/*.json` (static tips data) → `tips` + `tip_sections` tables
- `src/data/galleryImages.js` (Cloudinary tag fetch) → `gallery_images` table
- `src/pages/BlogPage/Blogs/{country}/{index}/*.constants.ts` (per-post content files) → `blog_blocks` + `blog_itineraries` tables
- `src/App.js` switch dispatch for blog routing → dynamic `[countrySlug]/[postIndex]` route
- All Python scripts (`scripts/`) → server actions + admin UI
- GitHub Pages deployment → Vercel + DB writes
- `sessionStorage` auth → Supabase Auth
- Admin JSON preview tab → eliminated (writes go directly to DB as drafts)
- Admin `sessionStorage` form persistence → replaced by draft rows in DB (auto-save on edit)
- `GalleryScriptRunner` and `TipsScriptRunner` → eliminated by direct DB writes

---

## 4. Implementation Plan

Ordered by dependency. Each phase produces a working increment.

### Phase 0: Finish the Foundation

*Goal: migration running, seed data in, Drizzle client fully wired.*

~~**0.1 Fix Drizzle client schema import**~~ DONE
- `db/index.ts` now imports `* as schema` and passes `drizzle(client, { schema })`

~~**0.2 Add tip_sections (tipId, position) unique + deferrable**~~ DONE
- Added `unique("tip_sections_tip_id_position_unique").on(t.tipId, t.position)` to schema.ts
- Added DROP+ADD for DEFERRABLE INITIALLY DEFERRED in post-init SQL
- Migration regenerated with the constraint in baseline

**0.3 Create `.env.example` + add Cloudinary env vars to server schema**
- Document all required env vars with placeholder values and comments
- Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` to `serverEnv` Zod schema now — Phase 2 (admin) needs them, but declaring the shape early prevents env drift
- Include both Supabase and Cloudinary vars

**0.4 Run migration against Supabase**
- `npm run db:migrate` — applies 0000_initial_schema.sql
- Verify in Supabase Studio: all 8 tables, triggers, RLS, deferrable constraints

**0.5 Add Supabase profile-creation trigger**
- SQL function + trigger on `auth.users` INSERT that creates a `profiles` row with `role = 'reader'`
- This is a Supabase-side trigger (on the `auth` schema) — create via Supabase SQL editor or a separate migration that references `auth.users`
- Ensures every authenticated user has a profile row for role checks

**0.6 Seed script: port v1 data to v2 tables**

This is the most complex Phase 0 task. The v1 data lives across TypeScript constants files, TSX components, JSON files, and a static JS array — each with slightly different shapes.

Sub-tasks:
1. **Parse v1 blog metadata** from `src/data/blogs.js` (12 posts). Map `blog_description` → `excerpt`, `folder` → `countrySlug` + `postIndex`, `created_at` → `createdAt` backfill. Set `status = 'published'`, `published_at = created_at`.
2. **Import v1 constants files** using `tsx` (TypeScript runner). Each `.constants.ts` exports a `BlogPostContent` object with `itineraries`, `content` sections, `description`, `header`, `subtitle`, `tipsSection`, `tipsLink`.
3. **Hardcode the 8 rendered map embed URLs** in the seed script as a `Record<string, string[]>` keyed by `countrySlug/postIndex`. These URLs live in `.tsx` JSX, not in the constants. They're static historical data — parsing JSX is over-engineered.
4. **Transform image filenames to Cloudinary public_ids**: `IMG_1355.jpeg` → `aroundtheworld50s/blog/trinidad-and-tobago/1/IMG_1355` (strip extension — Cloudinary public_ids don't include it).
5. **Map v1's `imageAlt`** to `leftImageAlt` or `rightImageAlt` based on which side has `type: "image"`.
6. **Convert `tipsLink` to `tipsSlug`**: strip `/aroundtheworld50s#/tips/` prefix, keep just the slug. Treat empty string `""` as `null`.
7. **Rewrite internal links in HTML content**: `href="/aroundtheworld50s#/tips/trinidad-and-tobago"` → `href="/tips/trinidad-and-tobago"`. Also `href="/aroundtheworld50s#/blog/..."` → `href="/blog/..."`. This is a regex replacement across all HTML fields (block `data.html`, post `description`, tip section `content`).
8. **Insert itineraries first**, capture returned UUIDs, then insert `itinerary_with_map` blocks referencing those UUIDs. Skip CT/1's orphaned itinerary (no block references it).
9. **Seed tips**: read 3 `tipsContent/*.json` files. Map camelCase section keys to snake_case enum values. Insert `tips` + `tip_sections`.
10. **Seed gallery**: either query Cloudinary tag API for `homePageGallery` image list, or use the hardcoded fallback from `galleryImages.js`. Insert into `gallery_images` with sequential positions.
11. Script is idempotent (delete-before-insert by `countrySlug`/`postIndex`, `slug`, `cloudinaryPublicId`).

### Phase 1: Public Read Path

*Goal: visitors can browse the blog, tips, and gallery from the DB. Feature parity with v1's public-facing site.*

**1.1 Cloudinary URL utility**
- `v2/src/lib/cloudinary.ts`
- Port v1's `getStaticAssetUrl`, `getBlogImageUrl`, `getGalleryImageUrl`
- Accept Cloudinary public_ids (v2 stores public_ids, not filenames)
- Cloud name and asset prefix from `lib/constants.ts`
- Export responsive image URL builder (width parameter) for Next.js Image component

**1.2 Shared layout + navbar**
- Root `layout.tsx`: fonts, global nav, footer
- **Fonts**: 4 fonts confirmed in use — Inter (body/buttons/nav), Caveat (hero overlay), Scope One (section headings), Grandstander (blog subtitle/description). Use `next/font` for self-hosting + automatic optimization. Do NOT install Dancing Script, Kalam, Dosis, or Playpen Sans (zero references in v1).
- `Navbar` component: logo (Cloudinary), nav links, social icons (Instagram, TikTok), mobile hamburger
- Transparent-on-hero logic (route-aware or prop-based)
- Admin link: **hidden for unauthenticated users**. Show only when session has admin role. No security-through-obscurity.
- **Dependency**: add `react-world-flags` — used on tips cards, world map hover, destinations

**1.3 Constants files**
- `lib/constants.ts`: Cloudinary cloud name (`dgfx5h5jl`), asset prefix (`aroundtheworld50s`), site name, tagline
- `lib/constants/socialLinks.ts`: Instagram URL, TikTok URL
- `lib/constants/worldMapCoordinates.ts`: port v1's 30+ coordinate entries from `WorldMap.constants.js`. These include aspirational destinations (Belize, France, Italy, etc.) with no blog posts — they're editorial intent, not derivable from DB.

**1.4 Data access layer (repositories)**
- `src/server/repositories/blog.ts`: `getPublishedPosts()`, `getPostBySlugAndIndex()`, `getPostsByCountrySlug()` — each returns post with blocks + itineraries + items via `db.query` relational API
- `src/server/repositories/tips.ts`: `getPublishedTips()`, `getTipBySlug()` — tip with sections ordered by position
- `src/server/repositories/gallery.ts`: `getGalleryImages()` — ordered by position
- All queries filter on `status = 'published'` for the public path
- Return Drizzle inferred types — no manual type declarations
- Drizzle `relations()` definitions added to `schema.ts` (TypeScript-only metadata, no migration) — required for the relational query API (`db.query.*.findFirst({ with: {...} })`)
- `blogPostsRelations` includes `author` relation to `profiles` for future use

**1.5 Blog pages**
- `app/blog/page.tsx` — listing grid, sorted by `published_at` desc (with `created_at` as secondary tiebreaker)
- `app/blog/[countrySlug]/page.tsx` — **full-screen parallax hero** (first post's `background_image` + country name overlay) + filtered listing grid. This is a prominent visual in v1 — not just a filtered list.
- `app/blog/[countrySlug]/[postIndex]/page.tsx` — full post detail
- **HTML rendering decision**: use `sanitize-html` server-side on all HTML content. Strip `<script>`, event handlers, and dangerous attributes. Allow safe tags (p, a, strong, em, br, span, div, ul, ol, li, h1-h6, img). This affects text blocks, two-column HTML, post description, and tip section content. Low XSS risk for admin-authored content, but sanitization at the render boundary is the right call for a lasting project.
- **Block renderer**: Server Component dispatching on `block.type`:
  - `TextBlock` — sanitized HTML render
  - `TwoColumnBlock` — left/right panes. Enforce at the Zod level: at least one side must be `"image"` and at least one `"text"`. The `html` field is the text-pane content.
  - `ImageGridBlock` — CSS grid of Cloudinary images via Next.js `<Image>` with Cloudinary loader
  - `ItineraryWithMapBlock` — itinerary item list + Google Maps iframe
- **Post hero**: parallax background image, title, subtitle, header
- **Tips CTA**: conditional section linking to `/tips/{tipsSlug}` (only when `tipsCtaCopy` is non-null)
- **CSS class dependency**: v1's blog HTML content uses classes like `post-link`. These must exist in v2's global styles. Port the specific CSS rules that blog content HTML depends on.
- Static generation with `generateStaticParams` for all published posts

**1.6 Tips pages**
- `app/tips/page.tsx` — listing grid with `react-world-flags` country flags on each card
- `app/tips/[slug]/page.tsx` — detail with sections (Essential Tips, Budget, Food, etc.)
- Render enabled sections only, ordered by `position`
- **Empty-section placeholder**: when a section has `enabled = true` but `content` is null/empty, show "This page will be automatically populated with practical travel advice..." — matches v1's UX
- **Not-found state**: if slug doesn't match any tip, render a specific message: "The tips page for '{slug}' doesn't exist yet" — not a generic 404. This tells the user the page will exist.
- HTML content sanitized (same rules as blog)

**1.7 Home page**
- Hero section with Cloudinary background image + overlay text
- "Travel With Us!" section
- Most recent posts (4, from DB query)
- **Gallery slider**: auto-advance every 5 seconds, 3 images per slide, "1-3 / 15" position counter. From DB, ordered by position.
- Instagram embed placeholder / fallback link (same as v1 — broken, shows link)

**1.8 Static pages + destinations**
- `app/about/page.tsx` — About Me content + EmailJS contact form (keep client-side EmailJS — no backend needed)
- `app/destinations/page.tsx`:
  - **Dropdown `<select>`** listing all destinations, navigates on change (port from `DestinationsPage.js:68-84`)
  - **WorldMap** component — full port of v1's interaction:
    - Flat world map image (Cloudinary)
    - Absolute-positioned invisible hit areas from coordinates constants
    - Hover: CSS flag-pole animation + `react-world-flags` flag + preview card (bg image + country name)
    - Click: navigate to `/blog/{countrySlug}`
    - 30+ aspirational destinations from static coordinates file
- `app/not-found.tsx` and `error.tsx` — error pages with Cloudinary GIF

**1.9 SEO**
- Per-page `metadata` exports (title, description, OG image from Cloudinary)
- `app/sitemap.ts` — dynamic sitemap from published posts + tips
- `app/robots.ts`
- JSON-LD structured data for blog posts (Article schema)

### Phase 2: Auth + Admin Read/Write

*Goal: the author can log in and create/edit content through the browser instead of Python scripts.*

**2.1 Auth flow**
- `app/login/page.tsx` — Supabase email/password login (or magic link)
- Create initial admin user in Supabase Auth dashboard, manually set `profiles.role = 'admin'`
- Server-side auth check utility: `getAuthenticatedAdmin()` — verifies session + `profiles.role = 'admin'`
- Protect admin routes with middleware or layout-level auth check

**2.2 RLS policies (migration 0001)**
- Public tables (`blog_posts`, `blog_blocks`, `blog_itineraries`, `blog_itinerary_items`, `tips`, `tip_sections`, `gallery_images`): `SELECT` where `status = 'published'` (or parent post/tip is published)
- Admin full access: `ALL` where `auth.uid()` maps to a `profiles` row with `role = 'admin'`
- `profiles`: users can `SELECT` their own row, admins can `SELECT ALL`
- Test with Supabase Studio as both anon and authenticated

**2.3 Admin layout**
- `app/admin/layout.tsx` — auth-gated layout, sidebar navigation (Blog, Tips, Gallery)
- Redirect to login if unauthenticated or non-admin

**2.4 Zod validation schemas**
- `src/server/validators/blog.ts`:
  - Discriminated union for block data keyed on `type`
  - `two_column` rule: at least one side must be `"image"` and at least one `"text"`. `html` is the text-pane content. Enforce this in Zod, not by convention.
  - Post metadata schema (title required, slug+index derived, etc.)
- `src/server/validators/tips.ts` — tip + section schemas
- `src/server/validators/gallery.ts` — gallery image schema
- Used at the server action boundary — never trust client input
- Keep in sync with `blog_blocks.data` shapes documented in schema.ts

**2.5 Blog admin**
- `app/admin/blog/page.tsx` — list all posts (draft + published), create new
- `app/admin/blog/[id]/page.tsx` — edit post metadata + blocks
- **Block editor**: form for each block type
  - Text: HTML textarea with preview pane (v1's author manages fine with raw HTML — a full rich text editor like tiptap is overkill for now, can be added later)
  - Two-column: left/right type pickers, image upload, text editor
  - Image grid: multi-image upload
  - Itinerary with map: select from post's itineraries
- **Itinerary editor**: add/remove/reorder itineraries + items per post
- **Image upload server action**: accepts file, uploads to Cloudinary via API (`CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET`), returns public_id
- **Save server action**: validates with Zod discriminated union, upserts `blog_posts` + child rows in a transaction. Draft rows auto-save — replaces v1's sessionStorage persistence.
- **Publish action**: sets `status = 'published'`, `published_at = now()`, calls `revalidatePath('/blog/...')`
- **Preview**: renders the post using the same block renderer as the public page
- **Position reorder**: drag-and-drop or move-up/down buttons, batch update in a deferred transaction
- **US state validation**: port v1's `stateValidation.js` fuzzy matching to `server/validators/`

**2.6 Tips admin**
- `app/admin/tips/page.tsx` — list all tips
- `app/admin/tips/[id]/page.tsx` — edit tip metadata + sections
- Section editor: HTML textarea + preview per section, enable/disable toggle, reorder
- Save + publish actions (same pattern as blog, `revalidatePath('/tips/...')`)

**2.7 Gallery admin**
- `app/admin/gallery/page.tsx` — view all gallery images, reorder, add/remove
- Upload action: file → Cloudinary → insert `gallery_images` row
- Remove action: delete from Cloudinary + DB
- Reorder: drag-and-drop, batch position update in deferred transaction
- `revalidatePath('/')` after changes (gallery is on the home page)

### Phase 3: Polish + Production

*Goal: production-grade, deployed, replacing v1.*

**3.1 Fonts + styling**
- After the Phase 1.2 font audit, install only fonts actually used
- Configure in `next/font` (automatic optimization, no layout shift)
- Port v1's custom Tailwind config to v4 CSS-based config: `tan` color (`#ccbca5`), font family mappings
- Port key CSS patterns: `.fixed-background-container` (hero parallax), blog grid, tips grid
- **Port content-dependent CSS classes**: `post-link` and any other classes used inside blog HTML content. These are rendered by `dangerouslySetInnerHTML`/sanitized HTML, so they must exist in v2's global stylesheet.

**3.2 Vercel deployment**
- Connect repo to Vercel
- Set environment variables:
  - `DATABASE_URL` → Supabase **transaction pooler** URL in production (not direct)
  - `DIRECT_URL` → Supabase direct connection (for migrations only)
  - All Supabase + Cloudinary vars
- Configure build: root directory `v2/`
- **Domain**: `www.aroundtheworld50s.com` is currently on GitHub Pages via CNAME. Point DNS A/CNAME records at Vercel. This is the specific domain to configure.

**3.3 Cache invalidation**
- Use `revalidatePath()` in every admin save/publish server action. When the admin publishes, the affected path is regenerated on next request.
- No ISR intervals, no edge caching complexity. For a personal blog with ~100 readers, on-demand revalidation is simpler, correct, and debuggable.

**3.4 Error handling + loading states**
- `loading.tsx` skeletons for blog list, post detail, tips
- `error.tsx` with retry
- `not-found.tsx` with navigation back to home
- Suspense boundaries around data-fetching components

**3.5 v1 redirect map**
- v1 uses HashRouter (`/#/blog/trinidad-and-tobago/1`)
- v2 uses real URLs (`/blog/trinidad-and-tobago/1`)
- Hash URLs can't be server-redirected (the hash never reaches the server)
- Add a small client-side script in root layout that checks `window.location.hash` on load and redirects `/#/blog/...` to `/blog/...`, `/#/tips/...` to `/tips/...`, etc. Covers bookmarks and shared links from v1.

**3.6 Analytics**
- Vercel Analytics (zero-config, included with Vercel hosting)

**3.7 Instagram embed (fast-follow)**
- `ALTER TYPE blog_block_type ADD VALUE 'instagram'`
- Block data shape: `{ postUrl: string }`
- Renderer: Instagram oEmbed API or embed.js with proper error handling
- Only do this when Instagram's embed reliably works

---

## 5. File Structure (target)

```
v2/src/
  app/
    layout.tsx                        # root layout: fonts, nav, footer, hash redirect script
    page.tsx                          # home page
    not-found.tsx
    error.tsx
    sitemap.ts
    robots.ts
    about/page.tsx
    destinations/page.tsx
    blog/
      page.tsx                        # all posts listing
      [countrySlug]/
        page.tsx                      # country hero + filtered listing
        [postIndex]/page.tsx          # post detail
    tips/
      page.tsx                        # all tips listing (with flags)
      [slug]/
        page.tsx                      # tip detail (inline not-found with slug in message)
    login/page.tsx
    admin/
      layout.tsx                      # auth-gated admin shell
      blog/
        page.tsx                      # post list + create
        [id]/page.tsx                 # post editor
      tips/
        page.tsx
        [id]/page.tsx
      gallery/page.tsx
  components/
    ui/                               # generic UI primitives
    shared/                           # app-wide shared components
      Navbar.tsx
      Footer.tsx
      ContactForm.tsx                 # EmailJS
    blog/                             # blog-specific components
      ParallaxHero.tsx                # shared hero for country + post detail pages
      BlogCard.tsx                    # post card with hover overlay
      BlogGrid.tsx                    # responsive 1→2→3 col grid
      BlockRenderer.tsx               # dispatcher switching on block.type
      TipsCta.tsx                     # blue card linking to tips page
      blocks/
        TextBlock.tsx
        TwoColumnBlock.tsx
        ImageGridBlock.tsx
        ItineraryWithMapBlock.tsx
        MapEmbed.tsx
    tips/
      CountryFlag.tsx                  # "use client" wrapper for react-world-flags
      TipCard.tsx
      TipSection.tsx
    gallery/
      GallerySlider.tsx               # auto-advance + counter
    destinations/
      WorldMap.tsx                     # hover interaction, flags, preview cards
      DestinationDropdown.tsx
    admin/
      BlogEditor.tsx
      BlockEditor.tsx
      TipEditor.tsx
      GalleryManager.tsx
      ImageUploader.tsx
  lib/
    cloudinary.ts                     # URL builder (cloud name, transforms, responsive)
    cloudinary-loader.ts              # Global Next.js Image loader (loaderFile in next.config.ts)
    sanitize.ts                       # sanitize-html wrapper with allowlisted tags
    format.ts                         # formatBlogDate, formatBlogDateWithYear
    constants.ts                      # site name, tagline, Cloudinary config
    constants/
      socialLinks.ts                  # Instagram, TikTok URLs
      tip-sections.ts                 # Section key → emoji label mapping, placeholder text
      worldMapCoordinates.ts          # 30+ destinations (aspirational + active)
    env/
      client.ts
      server.ts                       # includes Cloudinary vars
    supabase/
      client.ts
      server.ts
      middleware.ts
  server/
    auth/
      index.ts                        # getAuthenticatedAdmin(), requireAdmin()
    db/
      index.ts                        # Drizzle client with schema
      schema.ts
      migrations/
    repositories/
      blog.ts
      tips.ts
      gallery.ts
      profiles.ts
    services/
      blog.ts                         # business logic: create/update/publish post
      tips.ts
      gallery.ts
      cloudinary.ts                   # upload/delete via Cloudinary Node API
    validators/
      blog.ts                         # Zod schemas: block data discriminated union, post input
      tips.ts
      gallery.ts
      stateValidation.ts              # US state validation + fuzzy matching (ported from v1)
    actions/                          # Next.js server actions
      blog.ts
      tips.ts
      gallery.ts
      auth.ts
  types/
    blog.ts                           # Block data interfaces (TextBlockData, etc.) + FullBlogPost
  # Note: blog content CSS (post-link, parallax-hero, image-grid, etc.) lives in app/globals.css
  # rather than a separate styles/content.css — simpler for Tailwind v4's @apply directives
```

---

## 6. Suggested Build Order

1. **Phase 0.3-0.6** (env, migration, profile trigger, seed) — foundation. The seed script is the most complex single task.
2. **Phase 1.1-1.3** (Cloudinary util, layout/nav/fonts, constants) — get the shell rendering.
3. **Phase 1.4-1.5** (repositories + blog pages) — blog posts visible from DB.
4. **Phase 1.6-1.8** (tips, home, destinations, static pages) — full public site parity with v1.
5. **Phase 1.9** (SEO) — metadata, sitemap, structured data.
6. **Phase 2.1-2.3** (auth + admin layout) — login works, admin shell exists.
7. **Phase 2.4-2.7** (validators + admin CRUD) — the whole point of v2.
8. **Phase 3** (polish, deploy, v1 sunset).

Each phase should be a branch + PR, same pattern as the schema work.

---

## 7. Risks

**1. Seed script complexity.**
Map URLs live in JSX files. Twelve TypeScript constants files need importing with inconsistent shapes. Internal HTML links need rewriting. Recommended approach: hardcode the 8 map URLs, use `tsx` to import constants, regex-replace internal links. This is a full day of work, not a half-day sub-task.

**2. Internal links in HTML content are broken after migration.**
v1 blog content has `href="/aroundtheworld50s#/tips/trinidad-and-tobago"`. In v2 the path is `/tips/trinidad-and-tobago`. The seed script must rewrite these. Pattern: `href="/aroundtheworld50s#/` → `href="/`. Any link missed will be visibly broken to readers.

**3. CSS classes embedded in blog HTML content.**
v1's blog HTML uses classes like `class="post-link"` inside `dangerouslySetInnerHTML`. These rules must exist in v2's global stylesheet. If missed, styled links silently become unstyled. Port the specific CSS selectors from `BlogPost.css`.

**4. Rich text editing is the hardest admin UI problem.**
HTML textarea + preview is sufficient for this author (she manages raw HTML in v1 today). If that changes, tiptap is the standard React choice but is a significant dependency. Start simple.

**5. Cloudinary upload from server actions.**
Requires `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET` in server env. The Cloudinary Node SDK or signed upload URLs are the two paths. v1's Python scripts use the SDK pattern — port that.

**6. Font performance.**
v1 installs 8 fonts. Audit confirmed only 4 are used: Inter (body/buttons/nav), Caveat (hero overlay), Scope One (section headings), Grandstander (blog subtitle/description). The other 4 (Dancing Script, Kalam, Dosis, Playpen Sans) have zero references anywhere in v1 — do not install them in v2.

**7. Tailwind v3 → v4 migration.**
v1's custom config (extended fonts, colors, `@apply`) needs manual porting. Tailwind v4 uses CSS-based config, not `tailwind.config.js`.

---

## 8. Decisions Made

These were open questions in the first draft. Resolved based on review feedback:

| Question | Decision | Rationale |
|---|---|---|
| Contact form | Keep EmailJS | Zero backend, already working, no email delivery infra to manage |
| Analytics | Vercel Analytics | Zero-config, included with Vercel hosting, sufficient for ~100 readers |
| Cache invalidation | `revalidatePath()` in server actions | Simple, correct, debuggable. ISR is over-engineering for this scale. |
| HTML sanitization | `sanitize-html` server-side at render boundary | Low XSS risk for admin-authored content, but correct for a lasting project |
| Navbar admin link | Hidden for unauthenticated users | No security-through-obscurity. Show only when logged in as admin. |
| WorldMap coordinates | Static constants file | Aspirational destinations are editorial intent, not derivable from DB |
| Admin form persistence | Draft rows in DB | Replaces v1's sessionStorage. Auto-save on edit. |
| `two_column` enforcement | Zod validation, not convention | At least one side must be "image" and at least one "text". `html` goes in the text pane. |
| Rich text editor | Decide when we get to it | Start with HTML textarea + preview. Evaluate tiptap/Lexical only if the author finds raw HTML unworkable. |
| Image optimization | Global `loaderFile` in `next.config.ts` | Next.js 16 disallows function props to Client Components — `loader={fn}` on `<Image>` fails at build. Use `images.loaderFile` pointing to `src/lib/cloudinary-loader.ts`. All `<Image>` components use `src={publicId}` directly, no `loader` prop. |
| Hosting during transition | Both — v2 on Vercel's provided URL | v1 stays on GitHub Pages at `aroundtheworld50s.com`. v2 runs on the Vercel-provided URL (e.g. `project.vercel.app`) until validated, then DNS cutover. |
| Fonts | 4 fonts: Inter, Caveat, Scope One, Grandstander | Audit confirmed. Dancing Script, Kalam, Dosis, Playpen Sans have zero references in v1 — dead weight, do not install. |
| Near-duplicate posts NY2/NY3 | Seed as-is | Port everything exactly as it exists. CRUD logic is stable in either direction — can always delete later. |
| `font-scope` mapping | Scope One (intentional) | v1 mapped `font-scope` to Dosis — this was a naming bug. v2 corrects it to Scope One, which is what the class name implies. |
| Blog listing sort order | `published_at` desc, `created_at` as tiebreaker | `published_at` reflects when the author chose to publish, which is the meaningful date for readers. `created_at` is a secondary tiebreaker for posts published at the same instant. |
| Cloudinary loader quality | Custom transform string | `cloudinaryLoader` builds its own transform string (`f_auto,q_auto,w_{width}` or `f_auto,w_{width},q_{quality}`) to avoid double-specifying quality when Next.js passes an explicit quality value. |
| Navbar positioning | `absolute` (not `fixed`) | Matches v1 behavior — navbar scrolls with the page. |
| Image loader | Global `loaderFile` in `next.config.ts` | Next.js 16 / React 19 disallows passing functions as props to Client Components. Per-component `loader={fn}` fails at build. `cloudinary-loader.ts` is the standalone loader file. |
| DB connection | Transaction pooler (`aws-1-us-west-2.pooler.supabase.com:6543`) | Direct connection hostname (`db.*.supabase.co`) doesn't resolve from local dev. Pooler is Supabase's recommendation for ORMs. `prepare: false` already set. Password must be URL-encoded (special chars like `$`). |
| `text-center` on `.page-content` | Blog-only, not global | v1 only centers in `BlogPage.css`, not `layout.css`. Adding to base class would leak to tips/about/destinations pages. Applied via `text-center` class on blog route JSX instead. |
| Post title/subtitle HTML | `<h2>` / `<h3>` (semantic) | Hero is `<h1>`, post title is `<h2>`, subtitle is `<h3>`. Better document outline for SEO and accessibility. Class-based CSS still applies. |
| Tips not-found rendering | Inline UI (not `notFound()`) | Renders "The tips page for '{slug}' doesn't exist yet" with the slug preserved in the message — matches v1's UX intent. |
| `react-world-flags` wrapper | `"use client"` `CountryFlag.tsx` | The library's UMD bundle uses `this` reference that fails in RSC strict ESM evaluation. Thin client wrapper avoids the issue. |

---

## 9. Progress Tracker

<!-- Update this section after each step is completed -->

| Step | Status | Commit |
|---|---|---|
| Phase 0.1: Drizzle schema import | Done | `e954e6b` |
| Phase 0.2: tip_sections position unique | Done | `e954e6b` |
| Phase 0.3: .env.example + Cloudinary env vars | Done | `367321a` |
| Phase 0.4: Run migration against Supabase | Done | Applied via Supabase MCP |
| Phase 0.5: Profile-creation trigger | Done | Applied via Supabase MCP (`handle_new_user` + `on_auth_user_created`) |
| Phase 0.6: Seed script | Done | Applied via Supabase MCP (12 posts, 9 itineraries, 53 items, 102 blocks, 3 tips, 18 sections, 5 gallery) |
| Phase 1.1: Cloudinary URL utility | Done | `1d6b77e` — `lib/cloudinary.ts` with URL builder, Next.js Image loader, static assets map |
| Phase 1.2: Shared layout + navbar | Done | `1d6b77e` — Navbar (absolute positioning, transparent-on-hero, mobile menu), Footer, root layout with 4 `next/font` fonts |
| Phase 1.3: Constants files | Done | `1d6b77e` — `lib/constants.ts`, `lib/constants/social-links.ts`, `lib/constants/world-map-coordinates.ts` |
| Phase 1.4: Data access layer | Done | `feat/phase-1.4-data-access-layer` — Drizzle relations added to schema, blog/tips/gallery repositories |
| Phase 1.5: Blog pages | Done | `feat/phase-1.5-blog-pages` PR #4 — blog listing, country listing w/ parallax hero, post detail w/ block rendering, 17 new files |
| Phase 1.6: Tips pages | Done | `feat/phase-1.6-tips-pages` — tips listing w/ country flags, tip detail w/ section rendering, 7 new files |
| Phase 1.7: Home page | Done | `feat/phase-1.7-home-page` — parallax hero, Travel With Us section, 4 most recent posts (BlogGrid w/ columns prop), gallery slider (client component), Instagram fallback |
