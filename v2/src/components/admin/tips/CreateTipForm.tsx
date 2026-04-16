"use client";

import { useState, useTransition } from "react";
import { createTip } from "@/server/actions/tips";
import { US_STATES } from "@/lib/constants/us-states";
import { getCountryCode } from "@/lib/country-codes";
import { CountryCombobox } from "@/components/admin/CountryCombobox";
import { slugify } from "@/lib/slugify";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";

export function CreateTipForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [slug, setSlug] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [state, setState] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const isUS = countryCode.toUpperCase() === "US";

  const isDirty =
    slug !== "" ||
    country !== "" ||
    countryCode !== "" ||
    title !== "" ||
    description !== "";

  useUnsavedChanges(isDirty);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createTip({
        slug,
        country,
        countryCode,
        state: isUS && state ? state : null,
        title,
        description: description || null,
      });

      // createTip redirects on success, so we only get here on error
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

      {/* Slug */}
      <label className="block">
        <span className="mb-1 block text-sm font-medium">URL Path <span className="text-red-500">*</span></span>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="e.g. trinidad-and-tobago"
        />
        <span className="mt-1 block text-xs text-gray-400">
          Lowercase with hyphens. This becomes the web address: /tips/{slug || "your-path"}
        </span>
      </label>

      {/* Country + Country Code */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="mb-1 block text-sm font-medium">Country <span className="text-red-500">*</span></span>
          <CountryCombobox
            value={country}
            onChange={(val) => {
              setCountry(val);
              const code = getCountryCode(val);
              if (code) setCountryCode(code);
            }}
            onSelect={(name, code) => {
              setCountry(name);
              setCountryCode(code);
            }}
            placeholder="e.g. Trinidad and Tobago"
          />
        </div>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">
            Country Code (e.g. IL, US) <span className="text-red-500">*</span>
          </span>
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
          onBlur={() => {
            if (title && !slug) {
              setSlug(slugify(title));
            }
          }}
          required
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </label>

      {/* Description */}
      <div>
        <span className="mb-1 block text-sm font-medium">Description</span>
        <RichTextEditor
          value={description}
          onChange={setDescription}
          placeholder="Short description for the tips page"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Create Tip"}
      </button>

      <p className="mt-3 text-sm text-gray-500">
        After creating, you&apos;ll be taken to the editor where you can add
        sections and content.
      </p>
    </form>
  );
}
