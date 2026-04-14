"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateBlogPost } from "@/server/actions/blog-posts";
import { US_STATES } from "@/lib/constants/us-states";
import { ImageUploadButton } from "@/components/admin/ImageUploadButton";
import type { BlogPost } from "@/server/db/schema";

interface PostMetadataFormProps {
  post: BlogPost;
}

export function PostMetadataForm({ post }: PostMetadataFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState(post.title);
  const [subtitle, setSubtitle] = useState(post.subtitle ?? "");
  const [header, setHeader] = useState(post.header ?? "");
  const [description, setDescription] = useState(post.description ?? "");
  const [excerpt, setExcerpt] = useState(post.excerpt ?? "");
  const [backgroundImage, setBackgroundImage] = useState(
    post.backgroundImage ?? "",
  );
  const [tipsCtaCopy, setTipsCtaCopy] = useState(post.tipsCtaCopy ?? "");
  const [tipsSlug, setTipsSlug] = useState(post.tipsSlug ?? "");
  const [state, setState] = useState(post.state ?? "");

  const isUS = post.countryCode.toUpperCase() === "US";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await updateBlogPost(post.id, {
        title,
        subtitle: subtitle || null,
        header: header || null,
        description: description || null,
        excerpt: excerpt || null,
        backgroundImage: backgroundImage || null,
        tipsCtaCopy: tipsCtaCopy || null,
        tipsSlug: tipsSlug || null,
        state: isUS && state ? state : null,
      });

      if (result.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-lg font-semibold">Post Metadata</h2>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          Saved successfully.
        </div>
      )}

      {/* Read-only country info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="mb-1 block text-sm font-medium text-gray-500">
            Country (read-only)
          </span>
          <p className="text-sm">{post.country} ({post.countryCode})</p>
        </div>
        {isUS && (
          <label className="block">
            <span className="mb-1 block text-sm font-medium">State</span>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm"
            >
              <option value="">None</option>
              {US_STATES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Title *</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Subtitle</span>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Header</span>
        <input
          type="text"
          value={header}
          onChange={(e) => setHeader(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Excerpt</span>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Description (HTML)</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded border px-3 py-2 font-mono text-sm"
        />
      </label>

      {/* Background Image */}
      <div>
        <span className="mb-1 block text-sm font-medium">Background Image</span>
        {backgroundImage ? (
          <div className="flex items-center gap-3">
            <span className="truncate text-sm text-gray-600">
              {backgroundImage}
            </span>
            <button
              type="button"
              onClick={() => setBackgroundImage("")}
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <ImageUploadButton
            onUploaded={setBackgroundImage}
            folder={`aroundtheworld50s/blog/${post.countrySlug}/${post.postIndex}`}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Tips CTA Copy</span>
          <input
            type="text"
            value={tipsCtaCopy}
            onChange={(e) => setTipsCtaCopy(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Tips Slug</span>
          <input
            type="text"
            value={tipsSlug}
            onChange={(e) => setTipsSlug(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Metadata"}
      </button>
    </form>
  );
}
