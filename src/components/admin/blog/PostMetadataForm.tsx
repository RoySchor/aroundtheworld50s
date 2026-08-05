"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { updateBlogPost } from "@/server/actions/blog-posts";
import { US_STATES } from "@/lib/constants/us-states";
import { ImageUploadButton } from "@/components/admin/ImageUploadButton";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { slugify } from "@/lib/slugify";
import type { BlogPost } from "@/server/db/schema";

export interface PostMetadataState {
  title: string;
  subtitle: string;
  header: string;
  description: string;
  excerpt: string;
  backgroundImage: string;
  tipsCtaCopy: string;
  state: string;
}

interface PostMetadataFormProps {
  post: BlogPost;
  onStateChange?: (state: PostMetadataState) => void;
}

export function PostMetadataForm({ post, onStateChange }: PostMetadataFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState(post.title);
  const [subtitle, setSubtitle] = useState(post.subtitle ?? "");
  const [header, setHeader] = useState(post.header ?? "");
  const [description, setDescription] = useState(post.description ?? "");
  const [excerpt, setExcerpt] = useState(post.excerpt ?? "");
  const [backgroundImage, setBackgroundImage] = useState(post.backgroundImage ?? "");
  const [tipsCtaCopy, setTipsCtaCopy] = useState(post.tipsCtaCopy ?? "");
  const [state, setState] = useState(post.state ?? "");

  const isUS = post.countryCode.toUpperCase() === "US";

  const isDirty =
    title !== post.title ||
    subtitle !== (post.subtitle ?? "") ||
    header !== (post.header ?? "") ||
    description !== (post.description ?? "") ||
    excerpt !== (post.excerpt ?? "") ||
    backgroundImage !== (post.backgroundImage ?? "") ||
    tipsCtaCopy !== (post.tipsCtaCopy ?? "") ||
    state !== (post.state ?? "");

  useUnsavedChanges(isDirty);

  useEffect(() => {
    onStateChange?.({
      title,
      subtitle,
      header,
      description,
      excerpt,
      backgroundImage,
      tipsCtaCopy,
      state,
    });
  }, [
    title,
    subtitle,
    header,
    description,
    excerpt,
    backgroundImage,
    tipsCtaCopy,
    state,
    onStateChange,
  ]);

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
        tipsSlug: slugify(post.country),
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
    <form id="post-metadata-form" onSubmit={handleSubmit} className="space-y-5">
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
          <span className="mb-1 block text-sm font-medium text-gray-500">Country (read-only)</span>
          <p className="text-sm">
            {post.country} ({post.countryCode})
          </p>
        </div>
        {isUS && (
          <label className="block">
            <span className="mb-1 block text-sm font-medium">
              State <span className="text-red-500">*</span>
            </span>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              className="w-full rounded border px-3 py-2 text-sm"
            >
              <option value="">Select a state...</option>
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
        <span className="mb-1 block text-sm font-medium">
          Title <span className="text-red-500">*</span>
        </span>
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
        <span className="mb-1 block text-sm font-medium">Preview Text</span>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </label>

      <div>
        <span className="mb-1 block text-sm font-medium">Full Description</span>
        <RichTextEditor value={description} onChange={setDescription} />
      </div>

      {/* Background Image */}
      <div>
        <span className="mb-1 block text-sm font-medium">Background Image</span>
        {backgroundImage ? (
          <div className="flex items-center gap-3">
            <Image
              src={backgroundImage}
              alt="Background preview"
              width={64}
              height={40}
              className="rounded object-cover"
              style={{ width: 64, height: "auto" }}
            />
            <span className="truncate text-sm text-gray-600">{backgroundImage}</span>
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

      {/* Tips CTA */}
      <label className="block">
        <span className="mb-1 block text-sm font-medium">&ldquo;View Tips&rdquo; Button Text</span>
        <input
          type="text"
          value={tipsCtaCopy}
          onChange={(e) => setTipsCtaCopy(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder='e.g. "See our tips for Trinidad"'
        />
        <span className="mt-1 block text-xs text-gray-400">
          Links to: /tips/{slugify(post.country)}
        </span>
      </label>
    </form>
  );
}
