import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/server/repositories/blog";
import { getPublishedTips } from "@/server/repositories/tips";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, tips] = await Promise.all([
    getPublishedPosts(),
    getPublishedTips(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/destinations`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/tips`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const countrySlugs = [...new Set(posts.map((p) => p.countrySlug))];
  const countryPages: MetadataRoute.Sitemap = countrySlugs.map((slug) => {
    const latest = posts.find((p) => p.countrySlug === slug);
    return {
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: latest?.updatedAt ?? latest?.publishedAt ?? undefined,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    };
  });

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.countrySlug}/${post.postIndex}`,
    lastModified: post.updatedAt ?? post.publishedAt ?? undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const tipPages: MetadataRoute.Sitemap = tips.map((tip) => ({
    url: `${SITE_URL}/tips/${tip.slug}`,
    lastModified: tip.updatedAt ?? tip.publishedAt ?? undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...countryPages, ...postPages, ...tipPages];
}
