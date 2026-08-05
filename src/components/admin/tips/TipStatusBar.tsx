"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { publishTip, unpublishTip, deleteTip } from "@/server/actions/tips";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface TipStatusBarProps {
  tipId: string;
  status: string;
  slug: string;
  onPreview?: () => void;
}

export function TipStatusBar({ tipId, status, slug, onPreview }: TipStatusBarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const isPublished = status === "published";

  function handlePublishToggle() {
    setError(null);
    startTransition(async () => {
      const result = isPublished ? await unpublishTip(tipId) : await publishTip(tipId);
      if (!result.success) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  function handleConfirmDelete() {
    setShowConfirm(false);
    setError(null);
    startTransition(async () => {
      const result = await deleteTip(tipId);
      if (!result.success) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-4 rounded border bg-gray-50 p-4">
      <span
        className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
          isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>

      <button
        type="button"
        onClick={handlePublishToggle}
        disabled={isPending}
        className={`rounded px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50 ${
          isPublished ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isPending ? "..." : isPublished ? "Unpublish" : "Publish"}
      </button>

      <button
        type="submit"
        form="tip-metadata-form"
        className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Save Tip Changes
      </button>

      <button
        type="button"
        onClick={onPreview}
        className="rounded bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200"
      >
        Preview
      </button>

      {isPublished && (
        <a
          href={`/tips/${slug}`}
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
          onClick={() => setShowConfirm(true)}
          disabled={isPending}
          className="rounded px-4 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          Delete Tip
        </button>
      </div>

      {error && <p className="w-full text-sm text-red-600">{error}</p>}

      {showConfirm && (
        <ConfirmDialog
          title="Delete Tip"
          message="All content will be permanently removed."
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
