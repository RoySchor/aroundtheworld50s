"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { createBlogBlock, updateBlogBlock } from "@/server/actions/blog-blocks";
import { ImageUploadButton } from "@/components/admin/ImageUploadButton";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import type { BlogBlock, BlogItinerary, BlogItineraryItem } from "@/server/db/schema";
import type { BlockType } from "@/server/validators/blog";

interface BlockFormProps {
  postId: string;
  /** Existing block for editing. Omit for create mode. */
  block?: BlogBlock;
  /** Override type when creating a new block. */
  blockType?: BlockType;
  itineraries: (BlogItinerary & { items: BlogItineraryItem[] })[];
  onSaved: () => void;
  onCancel: () => void;
}

export function BlockForm({
  postId,
  block,
  blockType,
  itineraries,
  onSaved,
  onCancel,
}: BlockFormProps) {
  const isEdit = !!block;
  const type = (block?.type ?? blockType) as BlockType;
  const data = (block?.data ?? {}) as Record<string, unknown>;

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Text block state
  const [html, setHtml] = useState<string>((data.html as string) ?? "");

  // Two-column state
  const [leftType, setLeftType] = useState<"image" | "text">(
    (data.leftType as "image" | "text") ?? "image",
  );
  const [rightType, setRightType] = useState<"image" | "text">(
    (data.rightType as "image" | "text") ?? "text",
  );
  const [leftImage, setLeftImage] = useState<string>(
    (data.leftImage as string) ?? "",
  );
  const [leftImageAlt, setLeftImageAlt] = useState<string>(
    (data.leftImageAlt as string) ?? "",
  );
  const [rightImage, setRightImage] = useState<string>(
    (data.rightImage as string) ?? "",
  );
  const [rightImageAlt, setRightImageAlt] = useState<string>(
    (data.rightImageAlt as string) ?? "",
  );

  // Image grid state
  const [images, setImages] = useState<string[]>(
    (data.images as string[]) ?? [],
  );

  // Itinerary+map state
  const [itineraryId, setItineraryId] = useState<string>(
    (data.itineraryId as string) ?? "",
  );

  function moveImage(from: number, direction: "up" | "down") {
    const to = direction === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    [next[from], next[to]] = [next[to], next[from]];
    setImages(next);
  }

  function buildPayload() {
    switch (type) {
      case "text":
        return { type: "text" as const, html };
      case "two_column":
        return {
          type: "two_column" as const,
          leftType,
          rightType,
          leftImage: leftImage || undefined,
          leftImageAlt: leftImageAlt || undefined,
          rightImage: rightImage || undefined,
          rightImageAlt: rightImageAlt || undefined,
          html,
        };
      case "image_grid":
        return { type: "image_grid" as const, images };
      case "itinerary_with_map":
        return { type: "itinerary_with_map" as const, itineraryId };
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload = buildPayload();

    startTransition(async () => {
      const result = isEdit
        ? await updateBlogBlock(block.id, payload)
        : await createBlogBlock(postId, payload);

      if (result.success) {
        onSaved();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Text block */}
      {type === "text" && (
        <div>
          <span className="mb-1 block text-sm font-medium">Content</span>
          <RichTextEditor value={html} onChange={setHtml} />
        </div>
      )}

      {/* Two-column block */}
      {type === "two_column" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Left Side</span>
              <select
                value={leftType}
                onChange={(e) =>
                  setLeftType(e.target.value as "image" | "text")
                }
                className="w-full rounded border px-3 py-2 text-sm"
              >
                <option value="image">Image</option>
                <option value="text">Text</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Right Side</span>
              <select
                value={rightType}
                onChange={(e) =>
                  setRightType(e.target.value as "image" | "text")
                }
                className="w-full rounded border px-3 py-2 text-sm"
              >
                <option value="image">Image</option>
                <option value="text">Text</option>
              </select>
            </label>
          </div>

          {leftType === "image" && (
            <div>
              <span className="mb-1 block text-sm font-medium">Left Image</span>
              {leftImage ? (
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm text-gray-600">{leftImage}</span>
                  <button type="button" onClick={() => setLeftImage("")} className="text-sm text-red-600">Remove</button>
                </div>
              ) : (
                <ImageUploadButton onUploaded={setLeftImage} folder="aroundtheworld50s/blog" />
              )}
              <input
                type="text"
                value={leftImageAlt}
                onChange={(e) => setLeftImageAlt(e.target.value)}
                placeholder="Alt text"
                className="mt-2 w-full rounded border px-3 py-2 text-sm"
              />
            </div>
          )}

          {rightType === "image" && (
            <div>
              <span className="mb-1 block text-sm font-medium">Right Image</span>
              {rightImage ? (
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm text-gray-600">{rightImage}</span>
                  <button type="button" onClick={() => setRightImage("")} className="text-sm text-red-600">Remove</button>
                </div>
              ) : (
                <ImageUploadButton onUploaded={setRightImage} folder="aroundtheworld50s/blog" />
              )}
              <input
                type="text"
                value={rightImageAlt}
                onChange={(e) => setRightImageAlt(e.target.value)}
                placeholder="Alt text"
                className="mt-2 w-full rounded border px-3 py-2 text-sm"
              />
            </div>
          )}

          <div>
            <span className="mb-1 block text-sm font-medium">Text Content</span>
            <RichTextEditor value={html} onChange={setHtml} />
          </div>
        </>
      )}

      {/* Image grid block */}
      {type === "image_grid" && (
        <div>
          <span className="mb-1 block text-sm font-medium">Images</span>
          <div className="space-y-2">
            {images.map((img, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Image
                  src={img}
                  alt=""
                  width={48}
                  height={48}
                  className="rounded object-cover"
                />
                <span className="flex-1 truncate text-sm text-gray-600">
                  {img}
                </span>
                <button
                  type="button"
                  onClick={() => moveImage(idx, "up")}
                  disabled={idx === 0}
                  className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  title="Move up"
                >
                  &uarr;
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(idx, "down")}
                  disabled={idx === images.length - 1}
                  className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  title="Move down"
                >
                  &darr;
                </button>
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="text-sm text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2">
            <ImageUploadButton
              onUploaded={(publicId) => setImages([...images, publicId])}
              folder="aroundtheworld50s/blog"
            />
          </div>
        </div>
      )}

      {/* Itinerary with map block */}
      {type === "itinerary_with_map" && (
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Itinerary</span>
          {itineraries.length === 0 ? (
            <p className="text-sm text-gray-500">
              No itineraries. Create one in the Itineraries section below first.
            </p>
          ) : (
            <select
              value={itineraryId}
              onChange={(e) => setItineraryId(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm"
              required
            >
              <option value="">Select an itinerary...</option>
              {itineraries.map((itin) => (
                <option key={itin.id} value={itin.id}>
                  {itin.title}
                </option>
              ))}
            </select>
          )}
        </label>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Saving..." : isEdit ? "Update Block" : "Add Block"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
