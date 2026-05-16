"use client";

import { useCallback, useState } from "react";
import { slugify } from "@/lib/slugify";
import { PostStatusBar } from "@/components/admin/blog/PostStatusBar";
import { PostMetadataForm } from "@/components/admin/blog/PostMetadataForm";
import type { PostMetadataState } from "@/components/admin/blog/PostMetadataForm";
import { BlocksSection } from "@/components/admin/blog/BlocksSection";
import { ItinerariesSection } from "@/components/admin/blog/ItinerariesSection";
import { BlogPreviewModal } from "@/components/admin/blog/BlogPreviewModal";
import type { FullBlogPost } from "@/types/blog";

interface BlogEditClientProps {
  post: FullBlogPost;
}

export function BlogEditClient({ post }: BlogEditClientProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [metadata, setMetadata] = useState<PostMetadataState>({
    title: post.title,
    subtitle: post.subtitle ?? "",
    header: post.header ?? "",
    description: post.description ?? "",
    excerpt: post.excerpt ?? "",
    backgroundImage: post.backgroundImage ?? "",
    tipsCtaCopy: post.tipsCtaCopy ?? "",
    state: post.state ?? "",
  });

  const handleMetadataChange = useCallback((state: PostMetadataState) => {
    setMetadata(state);
  }, []);

  const previewPost = {
    title: metadata.title,
    subtitle: metadata.subtitle || null,
    header: metadata.header || null,
    description: metadata.description || null,
    backgroundImage: metadata.backgroundImage || null,
    tipsCtaCopy: metadata.tipsCtaCopy || null,
    tipsSlug: slugify(post.country),
    blocks: post.blocks,
    itineraries: post.itineraries,
  };

  return (
    <>
      <div className="sticky top-0 z-10 -mx-8 bg-gray-50 px-8 pb-4 pt-8 shadow-sm">
        <PostStatusBar
          postId={post.id}
          status={post.status}
          countrySlug={post.countrySlug}
          postIndex={post.postIndex}
          onPreview={() => setPreviewOpen(true)}
        />
      </div>

      <PostMetadataForm post={post} onStateChange={handleMetadataChange} />

      <hr />

      <BlocksSection
        postId={post.id}
        blocks={post.blocks}
        itineraries={post.itineraries}
      />

      <hr />

      <ItinerariesSection
        postId={post.id}
        itineraries={post.itineraries}
      />

      {previewOpen && (
        <BlogPreviewModal
          post={previewPost}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
}
