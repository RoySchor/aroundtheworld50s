"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateTip } from "@/server/actions/tips";
import { US_STATES } from "@/lib/constants/us-states";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import type { Tip } from "@/server/db/schema";

export interface TipMetadataState {
  title: string;
  description: string;
  state: string;
}

interface TipMetadataFormProps {
  tip: Tip;
  onStateChange?: (state: TipMetadataState) => void;
}

export function TipMetadataForm({ tip, onStateChange }: TipMetadataFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState(tip.title);
  const [description, setDescription] = useState(tip.description ?? "");
  const [state, setState] = useState(tip.state ?? "");

  const isUS = tip.countryCode.toUpperCase() === "US";

  const isDirty =
    title !== tip.title || description !== (tip.description ?? "") || state !== (tip.state ?? "");

  useUnsavedChanges(isDirty);

  useEffect(() => {
    onStateChange?.({ title, description, state });
  }, [title, description, state, onStateChange]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await updateTip(tip.id, {
        title,
        slug: tip.slug,
        description: description || null,
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
    <form id="tip-metadata-form" onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-lg font-semibold">Tip Metadata</h2>

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
            {tip.country} ({tip.countryCode})
          </p>
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

      <div>
        <span className="mb-1 block text-sm font-medium text-gray-500">
          URL Path (auto-generated)
        </span>
        <p className="text-sm text-gray-700">/tips/{tip.slug}</p>
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium">Description (SEO)</span>
        <RichTextEditor value={description} onChange={setDescription} />
        <span className="mt-1 block text-xs text-gray-400">
          Used for search engine meta tags only — not displayed on the page.
        </span>
      </div>
    </form>
  );
}
