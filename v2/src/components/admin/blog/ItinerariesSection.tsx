"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createBlogItinerary,
  updateBlogItinerary,
  deleteBlogItinerary,
  reorderBlogItinerary,
  createBlogItineraryItem,
  updateBlogItineraryItem,
  deleteBlogItineraryItem,
  reorderBlogItineraryItem,
} from "@/server/actions/blog-itineraries";
import type { BlogItinerary, BlogItineraryItem } from "@/server/db/schema";

interface ItinerariesSectionProps {
  postId: string;
  itineraries: (BlogItinerary & { items: BlogItineraryItem[] })[];
}

export function ItinerariesSection({
  postId,
  itineraries,
}: ItinerariesSectionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Add itinerary form
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newMapUrl, setNewMapUrl] = useState("");

  // Inline edit state
  const [editingItinId, setEditingItinId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editMapUrl, setEditMapUrl] = useState("");

  // Add item state
  const [addingItemItinId, setAddingItemItinId] = useState<string | null>(null);
  const [newItemContent, setNewItemContent] = useState("");

  // Edit item state
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemContent, setEditItemContent] = useState("");

  function refresh() {
    router.refresh();
  }

  // Itinerary CRUD
  function handleAddItinerary(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await createBlogItinerary(postId, {
        title: newTitle,
        mapEmbedUrl: newMapUrl || null,
      });
      setNewTitle("");
      setNewMapUrl("");
      setShowAdd(false);
      refresh();
    });
  }

  function handleUpdateItinerary(id: string) {
    startTransition(async () => {
      await updateBlogItinerary(id, {
        title: editTitle,
        mapEmbedUrl: editMapUrl || null,
      });
      setEditingItinId(null);
      refresh();
    });
  }

  function handleDeleteItinerary(id: string) {
    if (!confirm("Remove this itinerary? All its items will also be deleted.")) return;
    startTransition(async () => {
      await deleteBlogItinerary(id);
      refresh();
    });
  }

  function handleReorderItinerary(id: string, direction: "up" | "down") {
    startTransition(async () => {
      await reorderBlogItinerary(id, direction);
      refresh();
    });
  }

  // Item CRUD
  function handleAddItem(e: React.FormEvent, itineraryId: string) {
    e.preventDefault();
    startTransition(async () => {
      await createBlogItineraryItem(itineraryId, { content: newItemContent });
      setNewItemContent("");
      setAddingItemItinId(null);
      refresh();
    });
  }

  function handleUpdateItem(id: string) {
    startTransition(async () => {
      await updateBlogItineraryItem(id, { content: editItemContent });
      setEditingItemId(null);
      refresh();
    });
  }

  function handleDeleteItem(id: string) {
    if (!confirm("Remove this item?")) return;
    startTransition(async () => {
      await deleteBlogItineraryItem(id);
      refresh();
    });
  }

  function handleReorderItem(id: string, direction: "up" | "down") {
    startTransition(async () => {
      await reorderBlogItineraryItem(id, direction);
      refresh();
    });
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Itineraries</h2>

      {itineraries.length === 0 && !showAdd && (
        <p className="mb-4 text-sm text-gray-500">
          No itineraries yet. Add one to use in an Itinerary + Map block.
        </p>
      )}

      <div className="space-y-4">
        {itineraries.map((itin, itinIdx) => (
          <div key={itin.id} className="rounded border bg-white p-4">
            {/* Itinerary header */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-400">
                #{itinIdx + 1}
              </span>

              {editingItinId === itin.id ? (
                <div className="flex flex-1 gap-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 rounded border px-2 py-1 text-sm"
                  />
                  <input
                    type="text"
                    value={editMapUrl}
                    onChange={(e) => setEditMapUrl(e.target.value)}
                    placeholder="Map embed URL"
                    className="flex-1 rounded border px-2 py-1 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleUpdateItinerary(itin.id)}
                    disabled={isPending}
                    className="rounded bg-blue-600 px-3 py-1 text-xs text-white disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingItinId(null)}
                    className="text-xs text-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-sm font-medium">{itin.title}</span>
                  {itin.mapEmbedUrl && (
                    <span className="text-xs text-gray-400">(has map)</span>
                  )}
                </>
              )}

              <div className="ml-auto flex gap-1">
                <button
                  type="button"
                  onClick={() => handleReorderItinerary(itin.id, "up")}
                  disabled={isPending || itinIdx === 0}
                  className="rounded px-2 py-1 text-xs hover:bg-gray-100 disabled:opacity-30"
                >
                  &uarr;
                </button>
                <button
                  type="button"
                  onClick={() => handleReorderItinerary(itin.id, "down")}
                  disabled={isPending || itinIdx === itineraries.length - 1}
                  className="rounded px-2 py-1 text-xs hover:bg-gray-100 disabled:opacity-30"
                >
                  &darr;
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItinId(itin.id);
                    setEditTitle(itin.title);
                    setEditMapUrl(itin.mapEmbedUrl ?? "");
                  }}
                  className="rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteItinerary(itin.id)}
                  disabled={isPending}
                  className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="mt-3 ml-4 space-y-2">
              {itin.items.map((item, itemIdx) => (
                <div key={item.id} className="flex items-start gap-2">
                  <span className="mt-1 text-xs text-gray-400">
                    {itemIdx + 1}.
                  </span>

                  {editingItemId === item.id ? (
                    <div className="flex flex-1 gap-2">
                      <input
                        type="text"
                        value={editItemContent}
                        onChange={(e) => setEditItemContent(e.target.value)}
                        className="flex-1 rounded border px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateItem(item.id)}
                        disabled={isPending}
                        className="rounded bg-blue-600 px-2 py-1 text-xs text-white disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingItemId(null)}
                        className="text-xs text-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span className="flex-1 text-sm">{item.content}</span>
                  )}

                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleReorderItem(item.id, "up")}
                      disabled={isPending || itemIdx === 0}
                      className="rounded px-1 py-0.5 text-xs hover:bg-gray-100 disabled:opacity-30"
                    >
                      &uarr;
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorderItem(item.id, "down")}
                      disabled={isPending || itemIdx === itin.items.length - 1}
                      className="rounded px-1 py-0.5 text-xs hover:bg-gray-100 disabled:opacity-30"
                    >
                      &darr;
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItemId(item.id);
                        setEditItemContent(item.content);
                      }}
                      className="rounded px-1 py-0.5 text-xs text-blue-600 hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      disabled={isPending}
                      className="rounded px-1 py-0.5 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {/* Add item */}
              {addingItemItinId === itin.id ? (
                <form
                  onSubmit={(e) => handleAddItem(e, itin.id)}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={newItemContent}
                    onChange={(e) => setNewItemContent(e.target.value)}
                    placeholder="Item content"
                    required
                    className="flex-1 rounded border px-2 py-1 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={isPending}
                    className="rounded bg-blue-600 px-3 py-1 text-xs text-white disabled:opacity-50"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddingItemItinId(null)}
                    className="text-xs text-gray-500"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAddingItemItinId(itin.id);
                    setNewItemContent("");
                  }}
                  className="text-xs text-blue-600 hover:underline"
                >
                  + Add Item
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add itinerary */}
      {showAdd ? (
        <form onSubmit={handleAddItinerary} className="mt-4 space-y-3 rounded border bg-white p-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Title <span className="text-red-500">*</span></span>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              className="w-full rounded border px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Google Maps Link</span>
            <input
              type="url"
              value={newMapUrl}
              onChange={(e) => setNewMapUrl(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm"
              placeholder="https://www.google.com/maps/embed?..."
            />
            <span className="mt-1 block text-xs text-gray-400">
              Google Maps &rarr; Share &rarr; Embed a map &rarr; copy the src URL
            </span>
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="rounded bg-blue-600 px-4 py-1.5 text-sm text-white disabled:opacity-50"
            >
              {isPending ? "Adding..." : "Add Itinerary"}
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="mt-4 rounded border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          + Add Itinerary
        </button>
      )}
    </div>
  );
}
