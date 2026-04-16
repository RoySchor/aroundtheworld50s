"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateTipSection,
  reorderTipSection,
} from "@/server/actions/tips";
import { TIP_SECTION_LABELS } from "@/lib/constants/tip-sections";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import type { TipSection } from "@/server/db/schema";

interface TipSectionsEditorProps {
  sections: TipSection[];
  onDraftsChange?: (drafts: Record<string, string>) => void;
}

export function TipSectionsEditor({ sections, onDraftsChange }: TipSectionsEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useUnsavedChanges(Object.keys(drafts).length > 0);

  useEffect(() => {
    onDraftsChange?.(drafts);
  }, [drafts, onDraftsChange]);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function getDraft(section: TipSection) {
    return drafts[section.id] ?? section.content ?? "";
  }

  function setDraft(id: string, value: string) {
    setDrafts((prev) => ({ ...prev, [id]: value }));
  }

  function handleToggleEnabled(section: TipSection) {
    setError(null);
    startTransition(async () => {
      const result = await updateTipSection(section.id, {
        enabled: !section.enabled,
      });
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  function handleSaveContent(sectionId: string) {
    setError(null);
    const section = sections.find((s) => s.id === sectionId);
    const content = drafts[sectionId] ?? section?.content ?? null;
    startTransition(async () => {
      const result = await updateTipSection(sectionId, { content });
      if (result.success) {
        setDrafts((prev) => {
          const next = { ...prev };
          delete next[sectionId];
          return next;
        });
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  function handleReorder(id: string, direction: "up" | "down") {
    setError(null);
    startTransition(async () => {
      const result = await reorderTipSection(id, direction);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Sections</h2>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {sections.map((section, idx) => {
        const isExpanded = expandedId === section.id;
        const label =
          TIP_SECTION_LABELS[section.sectionKey] ?? section.sectionKey;

        return (
          <div
            key={section.id}
            className="rounded border bg-white"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-xs font-medium text-gray-400">
                #{idx + 1}
              </span>

              <span className="font-medium">{label}</span>

              <span
                className={`ml-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  section.enabled
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {section.enabled ? "Enabled" : "Disabled"}
              </span>

              <div className="ml-auto flex items-center gap-2">
                {/* Reorder */}
                <button
                  type="button"
                  onClick={() => handleReorder(section.id, "up")}
                  disabled={isPending || idx === 0}
                  className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  title="Move up"
                >
                  &uarr;
                </button>
                <button
                  type="button"
                  onClick={() => handleReorder(section.id, "down")}
                  disabled={isPending || idx === sections.length - 1}
                  className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  title="Move down"
                >
                  &darr;
                </button>

                {/* Toggle enabled */}
                <button
                  type="button"
                  onClick={() => handleToggleEnabled(section)}
                  disabled={isPending}
                  className={`rounded px-3 py-1 text-xs font-medium disabled:opacity-50 ${
                    section.enabled
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }`}
                >
                  {section.enabled ? "Disable" : "Enable"}
                </button>

                {/* Expand / Collapse */}
                <button
                  type="button"
                  onClick={() => toggleExpand(section.id)}
                  className="rounded px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                >
                  {isExpanded ? "Collapse" : "Edit"}
                </button>
              </div>
            </div>

            {/* Body */}
            {isExpanded && (
              <div className="border-t px-4 py-4">
                <div>
                  <span className="mb-1 block text-sm font-medium">
                    Content
                  </span>
                  <RichTextEditor
                    value={getDraft(section)}
                    onChange={(v) => setDraft(section.id, v)}
                  />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSaveContent(section.id)}
                    disabled={isPending}
                    className="rounded bg-blue-600 px-5 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isPending ? "Saving..." : "Save Content"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDrafts((prev) => {
                        const next = { ...prev };
                        delete next[section.id];
                        return next;
                      });
                      toggleExpand(section.id);
                    }}
                    className="rounded px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
