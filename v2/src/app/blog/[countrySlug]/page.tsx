import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPublishedPosts,
  getPostsByCountrySlug,
} from "@/server/repositories/blog";
import { formatLocation } from "@/lib/format";
import { getOgImageUrl } from "@/lib/seo";
import { ParallaxHero } from "@/components/blog/ParallaxHero";
import { BlogGrid } from "@/components/blog/BlogGrid";

interface PageProps {
  params: Promise<{ countrySlug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  const slugs = [...new Set(posts.map((p) => p.countrySlug))];
  return slugs.map((countrySlug) => ({ countrySlug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { countrySlug } = await params;
  const posts = await getPostsByCountrySlug(countrySlug);
  if (posts.length === 0) return {};
  const displayName = formatLocation(posts[0]);
  const description = `Travel stories and adventures from ${displayName}.`;
  return {
    title: displayName,
    description,
    openGraph: {
      title: displayName,
      description,
      images: posts[0].backgroundImage
        ? [{ url: getOgImageUrl(posts[0].backgroundImage), width: 1200, height: 630 }]
        : undefined,
    },
  };
}

export default async function CountryBlogPage({ params }: PageProps) {
  const { countrySlug } = await params;
  const posts = await getPostsByCountrySlug(countrySlug);

  if (posts.length === 0) notFound();

  const displayName = formatLocation(posts[0]);
  const heroImage = posts[0].backgroundImage;

  return (
    <div className="page-container">
      {heroImage && (
        <ParallaxHero imagePublicId={heroImage} title={displayName} />
      )}

      <div className="container">
        <div className="page-content text-center">
          <h1 className="page-title">{displayName}</h1>
          <BlogGrid posts={posts} showYear />
        </div>
      </div>
    </div>
  );
}
