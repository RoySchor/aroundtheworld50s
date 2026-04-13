import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPublishedPosts,
  getPostBySlugAndIndex,
} from "@/server/repositories/blog";
import { sanitizeHtml } from "@/lib/sanitize";
import { ParallaxHero } from "@/components/blog/ParallaxHero";
import { BlockRenderer } from "@/components/blog/BlockRenderer";
import { TipsCta } from "@/components/blog/TipsCta";

interface PageProps {
  params: Promise<{ countrySlug: string; postIndex: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({
    countrySlug: p.countrySlug,
    postIndex: String(p.postIndex),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { countrySlug, postIndex } = await params;
  const post = await getPostBySlugAndIndex(countrySlug, Number(postIndex));
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const { countrySlug, postIndex } = await params;
  const post = await getPostBySlugAndIndex(countrySlug, Number(postIndex));

  if (!post) notFound();

  return (
    <div className="page-container">
      {post.backgroundImage && post.header && (
        <ParallaxHero
          imagePublicId={post.backgroundImage}
          title={post.header}
        />
      )}

      <div className="container">
        <div className="page-content text-center">
          <h2 className="post-title">{post.title}</h2>

          {post.subtitle && (
            <h3 className="post-subtitle">{post.subtitle}</h3>
          )}

          {post.description && (
            <div
              className="post-description"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(post.description),
              }}
            />
          )}

          {post.tipsCtaCopy && post.tipsSlug && (
            <TipsCta ctaCopy={post.tipsCtaCopy} tipsSlug={post.tipsSlug} />
          )}

          {post.blocks.map((block) => (
            <div key={block.id}>
              <BlockRenderer
                block={block}
                itineraries={post.itineraries}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
