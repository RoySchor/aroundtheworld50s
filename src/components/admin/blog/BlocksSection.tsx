"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteBlogBlock, reorderBlogBlock } from "@/server/actions/blog-blocks";
import { BlockForm } from "./BlockForm";
import type { BlogBlock, BlogItinerary, BlogItineraryItem } from "@/server/db/schema";
import type { BlockType } from "@/server/validators/blog";

const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  text: "Text",
  two_column: "Two Column",
  image_grid: "Image Grid",
  image_carousel: "Image Carousel",
  itinerary_with_map: "Itinerary + Map",
  social_embed: "Social Embed",
};

interface BlocksSectionProps {
  postId: string;
  blocks: BlogBlock[];
  itineraries: (BlogItinerary & { items: BlogItineraryItem[] })[];
}

export function BlocksSection({ postId, blocks, itineraries }: BlocksSectionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [addingType, setAddingType] = useState<BlockType | null>(null);

  function handleReorder(blockId: string, direction: "up" | "down") {
    startTransition(async () => {
      await reorderBlogBlock(blockId, direction);
      router.refresh();
    });
  }

  function handleDelete(blockId: string) {
    if (!confirm("Delete this block?")) return;
    startTransition(async () => {
      await deleteBlogBlock(blockId);
      router.refresh();
    });
  }

  function handleSaved() {
    setEditingBlockId(null);
    setAddingType(null);
    router.refresh();
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Content Blocks</h2>

      {blocks.length === 0 && !addingType && (
        <p className="mb-4 text-sm text-gray-500">No blocks yet. Add one below.</p>
      )}

      <div className="space-y-3">
        {blocks.map((block, idx) => (
          <div key={block.id} className="rounded border bg-white p-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-400">#{idx + 1}</span>
              <span className="text-sm font-medium">
                {BLOCK_TYPE_LABELS[block.type as BlockType] ?? block.type}
              </span>

              <div className="ml-auto flex gap-1">
                <button
                  type="button"
                  onClick={() => handleReorder(block.id, "up")}
                  disabled={isPending || idx === 0}
                  className="rounded px-2 py-1 text-xs hover:bg-gray-100 disabled:opacity-30"
                  title="Move up"
                >
                  &uarr;
                </button>
                <button
                  type="button"
                  onClick={() => handleReorder(block.id, "down")}
                  disabled={isPending || idx === blocks.length - 1}
                  className="rounded px-2 py-1 text-xs hover:bg-gray-100 disabled:opacity-30"
                  title="Move down"
                >
                  &darr;
                </button>
                <button
                  type="button"
                  onClick={() => setEditingBlockId(editingBlockId === block.id ? null : block.id)}
                  className="rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50"
                >
                  {editingBlockId === block.id ? "Close" : "Edit"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(block.id)}
                  disabled={isPending}
                  className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>

            {editingBlockId === block.id && (
              <div className="mt-4 border-t pt-4">
                <BlockForm
                  postId={postId}
                  block={block}
                  itineraries={itineraries}
                  onSaved={handleSaved}
                  onCancel={() => setEditingBlockId(null)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add block */}
      {addingType ? (
        <div className="mt-4 rounded border bg-white p-4">
          <h3 className="mb-3 text-sm font-medium">New {BLOCK_TYPE_LABELS[addingType]} Block</h3>
          <BlockForm
            postId={postId}
            blockType={addingType}
            itineraries={itineraries}
            onSaved={handleSaved}
            onCancel={() => setAddingType(null)}
          />
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {(Object.keys(BLOCK_TYPE_LABELS) as BlockType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setAddingType(type)}
              className="rounded border px-3 py-1.5 text-sm transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            >
              + {BLOCK_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
