import { notFound } from "next/navigation";
import { getPostById } from "@/server/repositories/admin-blog";
import { sanitizeHtml } from "@/lib/sanitize";
import { ParallaxHero } from "@/components/blog/ParallaxHero";
import { BlockRenderer } from "@/components/blog/BlockRenderer";
import { TipsCta } from "@/components/blog/TipsCta";

export const dynamic = "force-dynamic";

export default async function BlogPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);

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
