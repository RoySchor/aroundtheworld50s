"use client";

import { useState, useTransition } from "react";
import { createBlogPost } from "@/server/actions/blog-posts";
import { US_STATES } from "@/lib/constants/us-states";
import { getCountryCode } from "@/lib/country-codes";
import { ImageUploadButton } from "@/components/admin/ImageUploadButton";
import { HtmlHelperText } from "@/components/admin/HtmlHelperText";

export function CreatePostForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [state, setState] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [header, setHeader] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [description, setDescription] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [tipsCtaCopy, setTipsCtaCopy] = useState("");
  const [tipsSlug, setTipsSlug] = useState("");

  const isUS = countryCode.toUpperCase() === "US";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createBlogPost({
        country,
        countryCode,
        state: isUS && state ? state : null,
        title,
        subtitle: subtitle || null,
        header: header || null,
        excerpt: excerpt || null,
        description: description || null,
        backgroundImage: backgroundImage || null,
        tipsCtaCopy: tipsCtaCopy || null,
        tipsSlug: tipsSlug || null,
      });

      // createBlogPost redirects on success, so we only get here on error
      if (!result.success) {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Country + Country Code */}
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Country <span className="text-red-500">*</span></span>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            onBlur={() => {
              if (country && !countryCode) {
                const code = getCountryCode(country);
                if (code) setCountryCode(code);
              }
            }}
            required
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="e.g. Trinidad and Tobago"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Country Code (e.g. IL, US) <span className="text-red-500">*</span></span>
          <input
            type="text"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            required
            maxLength={3}
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="e.g. TT"
          />
        </label>
      </div>

      {/* US State (conditional) */}
      {isUS && (
        <label className="block">
          <span className="mb-1 block text-sm font-medium">State</span>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
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

      {/* Title */}
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Title <span className="text-red-500">*</span></span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </label>

      {/* Subtitle */}
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Subtitle</span>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </label>

      {/* Header */}
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Header</span>
        <input
          type="text"
          value={header}
          onChange={(e) => setHeader(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="e.g. A Week in Trinidad"
        />
      </label>

      {/* Excerpt */}
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Preview Text</span>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="Short description for listing cards"
        />
      </label>

      {/* Description (HTML) */}
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Full Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded border px-3 py-2 font-mono text-sm"
          placeholder="Long HTML body for post detail page"
        />
      </label>
      <HtmlHelperText />

      {/* Background Image */}
      <div>
        <span className="mb-1 block text-sm font-medium">Background Image</span>
        {backgroundImage ? (
          <div className="flex items-center gap-3">
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
            folder="aroundtheworld50s/blog"
          />
        )}
      </div>

      {/* Tips CTA */}
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Tips Link Text</span>
          <input
            type="text"
            value={tipsCtaCopy}
            onChange={(e) => setTipsCtaCopy(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Tips URL Path</span>
          <input
            type="text"
            value={tipsSlug}
            onChange={(e) => setTipsSlug(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="e.g. trinidad-and-tobago"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}
