import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConfirmBackLink } from "@/components/admin/ConfirmBackLink";
import { getPostById } from "@/server/repositories/admin-blog";
import { BlogEditClient } from "@/components/admin/blog/BlogEditClient";

export const metadata: Metadata = {
  title: "Edit Blog Post",
};

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <ConfirmBackLink href="/admin/blog">Back to Blog Posts</ConfirmBackLink>

      <div>
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <p className="mt-1 text-sm text-gray-500">
          {post.country}
          {post.state ? ` (${post.state})` : ""} &mdash; /blog/{post.countrySlug}/{post.postIndex}
        </p>
      </div>

      <BlogEditClient post={post} />
    </div>
  );
}
