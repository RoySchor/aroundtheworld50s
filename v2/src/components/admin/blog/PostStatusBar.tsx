"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  publishBlogPost,
  unpublishBlogPost,
  deleteBlogPost,
} from "@/server/actions/blog-posts";

interface PostStatusBarProps {
  postId: string;
  status: string;
  countrySlug: string;
  postIndex: number;
}

export function PostStatusBar({
  postId,
  status,
  countrySlug,
  postIndex,
}: PostStatusBarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isPublished = status === "published";

  function handlePublishToggle() {
    setError(null);
    startTransition(async () => {
      const result = isPublished
        ? await unpublishBlogPost(postId)
        : await publishBlogPost(postId);
      if (!result.success) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!confirm("Delete this post? All content will be permanently removed.")) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteBlogPost(postId);
      // deleteBlogPost redirects on success
      if (!result.success) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-4 rounded border bg-gray-50 p-4">
      <span
        className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
          isPublished
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>

      <button
        type="button"
        onClick={handlePublishToggle}
        disabled={isPending}
        className={`rounded px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50 ${
          isPublished
            ? "bg-yellow-600 hover:bg-yellow-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isPending
          ? "..."
          : isPublished
            ? "Unpublish"
            : "Publish"}
      </button>

      <button
        type="submit"
        form="post-metadata-form"
        className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Save Blog Changes
      </button>

      <Link
        href={`/admin/blog/${postId}/preview`}
        className="rounded bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200"
      >
        Preview
      </Link>

      {isPublished && (
        <a
          href={`/blog/${countrySlug}/${postIndex}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          View public page
        </a>
      )}

      <div className="ml-auto">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="rounded px-4 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          Delete Post
        </button>
      </div>

      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </div>
  );
}
