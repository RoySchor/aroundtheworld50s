import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostById } from "@/server/repositories/admin-blog";
import { PostStatusBar } from "@/components/admin/blog/PostStatusBar";
import { PostMetadataForm } from "@/components/admin/blog/PostMetadataForm";
import { BlocksSection } from "@/components/admin/blog/BlocksSection";
import { ItinerariesSection } from "@/components/admin/blog/ItinerariesSection";

export const metadata: Metadata = {
  title: "Edit Blog Post",
};

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <p className="mt-1 text-sm text-gray-500">
          {post.country}
          {post.state ? ` (${post.state})` : ""} &mdash;{" "}
          /blog/{post.countrySlug}/{post.postIndex}
        </p>
      </div>

      <PostStatusBar
        postId={post.id}
        status={post.status}
        countrySlug={post.countrySlug}
        postIndex={post.postIndex}
      />

      <PostMetadataForm post={post} />

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
    </div>
  );
}
