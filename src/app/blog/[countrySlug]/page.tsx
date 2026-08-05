import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostsByCountrySlug } from "@/server/repositories/blog";
import { getCoverOverride } from "@/server/repositories/cover-photos";
import { formatLocation } from "@/lib/format";
import { SITE_NAME } from "@/lib/constants";
import { getOgImageUrl } from "@/lib/seo";
import { ParallaxHero } from "@/components/blog/ParallaxHero";
import { BlogGrid } from "@/components/blog/BlogGrid";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ countrySlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { countrySlug } = await params;
  const [posts, override] = await Promise.all([
    getPostsByCountrySlug(countrySlug),
    getCoverOverride(countrySlug),
  ]);
  if (posts.length === 0) return {};
  const displayName = formatLocation(posts[0]);
  const description = `Travel stories and adventures from ${displayName}.`;
  const heroImage = override?.coverImage ?? posts[0].backgroundImage;
  return {
    title: displayName,
    description,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      title: displayName,
      description,
      images: heroImage ? [{ url: getOgImageUrl(heroImage), width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function CountryBlogPage({ params }: PageProps) {
  const { countrySlug } = await params;
  const [posts, override] = await Promise.all([
    getPostsByCountrySlug(countrySlug),
    getCoverOverride(countrySlug),
  ]);

  if (posts.length === 0) notFound();

  const displayName = formatLocation(posts[0]);
  const heroImage = override?.coverImage ?? posts[0].backgroundImage;

  return (
    <div className="page-container">
      {heroImage && <ParallaxHero imagePublicId={heroImage} title={displayName} />}

      <div className="container">
        <div className="page-content text-center">
          <h1 className="page-title">{displayName}</h1>
          <BlogGrid posts={posts} showYear />
        </div>
      </div>
    </div>
  );
}
