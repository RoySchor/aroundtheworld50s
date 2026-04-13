import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPublishedPosts,
  getPostsByCountrySlug,
} from "@/server/repositories/blog";
import { ParallaxHero } from "@/components/blog/ParallaxHero";
import { BlogGrid } from "@/components/blog/BlogGrid";

interface PageProps {
  params: Promise<{ countrySlug: string }>;
}

function getDisplayName(post: { state: string | null; country: string }) {
  return post.state ? `${post.state}, ${post.country}` : post.country;
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
  const displayName = getDisplayName(posts[0]);
  return { title: displayName };
}

export default async function CountryBlogPage({ params }: PageProps) {
  const { countrySlug } = await params;
  const posts = await getPostsByCountrySlug(countrySlug);

  if (posts.length === 0) notFound();

  const displayName = getDisplayName(posts[0]);
  const heroImage = posts[0].backgroundImage;

  return (
    <div className="page-container">
      {heroImage && (
        <ParallaxHero imagePublicId={heroImage} title={displayName} />
      )}

      <div className="container">
        <div className="page-content">
          <h1 className="page-title">{displayName}</h1>
          <BlogGrid posts={posts} showYear />
        </div>
      </div>
    </div>
  );
}
