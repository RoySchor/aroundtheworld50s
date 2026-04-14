"use client";

import { useState, useTransition } from "react";
import { createTip } from "@/server/actions/tips";
import { US_STATES } from "@/lib/constants/us-states";

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
        <span className="mb-1 block text-sm font-medium">Slug *</span>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="e.g. trinidad-and-tobago"
        />
        <span className="mt-1 block text-xs text-gray-400">
          Lowercase with hyphens. Used in URL: /tips/{slug || "..."}
        </span>
      </label>

      {/* Country + Country Code */}
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Country *</span>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="e.g. Trinidad and Tobago"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">
            Country Code *
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
        <span className="mb-1 block text-sm font-medium">Title *</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </label>

      {/* Description */}
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="Short description for the tips page"
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Create Tip"}
      </button>
    </form>
  );
}
