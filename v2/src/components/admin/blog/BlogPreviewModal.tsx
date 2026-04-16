"use client";

import { useEffect } from "react";
import { sanitizeHtml } from "@/lib/sanitize";
import { ParallaxHero } from "@/components/blog/ParallaxHero";
import { BlockRenderer } from "@/components/blog/BlockRenderer";
import { TipsCta } from "@/components/blog/TipsCta";
import type {
  BlogBlock,
  BlogItinerary,
  BlogItineraryItem,
} from "@/server/db/schema";

interface BlogPreviewModalProps {
  post: {
    title: string;
    subtitle: string | null;
    header: string | null;
    description: string | null;
    backgroundImage: string | null;
    tipsCtaCopy: string | null;
    tipsSlug: string | null;
    blocks: BlogBlock[];
    itineraries: (BlogItinerary & { items: BlogItineraryItem[] })[];
  };
  onClose: () => void;
}

export function BlogPreviewModal({ post, onClose }: BlogPreviewModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-white">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-gray-900 px-4 py-2 text-white">
        <span className="text-sm font-medium">Preview Mode</span>
        <button
          type="button"
          onClick={onClose}
          className="rounded bg-white/20 px-3 py-1 text-sm hover:bg-white/30"
        >
          Close Preview
        </button>
      </div>

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
              <TipsCta
                ctaCopy={post.tipsCtaCopy}
                tipsSlug={post.tipsSlug}
              />
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
    </div>
  );
}
