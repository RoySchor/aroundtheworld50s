"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { createBlogBlock, updateBlogBlock } from "@/server/actions/blog-blocks";
import { ImageUploadButton } from "@/components/admin/ImageUploadButton";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { SocialEmbedBlock } from "@/components/blog/blocks/SocialEmbedBlock";
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
  const [leftImages, setLeftImages] = useState<Array<{ publicId: string; alt?: string }>>(
    (data.leftImages as Array<{ publicId: string; alt?: string }>) ?? [],
  );
  const [rightImages, setRightImages] = useState<Array<{ publicId: string; alt?: string }>>(
    (data.rightImages as Array<{ publicId: string; alt?: string }>) ?? [],
  );

  // Image grid state
  const [images, setImages] = useState<string[]>(
    (data.images as string[]) ?? [],
  );

  // Image carousel state
  const [carouselImages, setCarouselImages] = useState<Array<{ publicId: string; caption?: string }>>(
    (data.images as Array<{ publicId: string; caption?: string }>) ?? [],
  );

  // Itinerary+map state
  const [itineraryId, setItineraryId] = useState<string>(
    (data.itineraryId as string) ?? "",
  );

  // Social embed state
  const [embedPlatform, setEmbedPlatform] = useState<"instagram" | "tiktok">(
    (data.platform as "instagram" | "tiktok") ?? "instagram",
  );
  const [embedUrl, setEmbedUrl] = useState<string>((data.url as string) ?? "");
  const [showEmbedPreview, setShowEmbedPreview] = useState(false);

  function moveImage(from: number, direction: "up" | "down") {
    const to = direction === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    [next[from], next[to]] = [next[to], next[from]];
    setImages(next);
  }

  function moveSideImage(
    side: "left" | "right",
    from: number,
    direction: "up" | "down",
  ) {
    const setter = side === "left" ? setLeftImages : setRightImages;
    const arr = side === "left" ? leftImages : rightImages;
    const to = direction === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= arr.length) return;
    const next = [...arr];
    [next[from], next[to]] = [next[to], next[from]];
    setter(next);
  }

  function moveCarouselImage(from: number, direction: "up" | "down") {
    const to = direction === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= carouselImages.length) return;
    const next = [...carouselImages];
    [next[from], next[to]] = [next[to], next[from]];
    setCarouselImages(next);
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
          leftImages: leftImages.length > 0 ? leftImages : undefined,
          rightImages: rightImages.length > 0 ? rightImages : undefined,
          html,
        };
      case "image_grid":
        return { type: "image_grid" as const, images };
      case "image_carousel":
        return { type: "image_carousel" as const, images: carouselImages };
      case "itinerary_with_map":
        return { type: "itinerary_with_map" as const, itineraryId };
      case "social_embed":
        return { type: "social_embed" as const, platform: embedPlatform, url: embedUrl };
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
              <span className="mb-1 block text-sm font-medium">Left Images</span>
              <div className="space-y-2">
                {leftImages.map((img, idx) => (
                  <div key={img.publicId} className="flex items-center gap-2">
                    <Image
                      src={img.publicId}
                      alt={img.alt || "Left preview"}
                      width={48}
                      height={48}
                      className="rounded object-cover"
                      style={{ width: 48, height: "auto" }}
                    />
                    <input
                      type="text"
                      value={img.alt ?? ""}
                      onChange={(e) => {
                        const next = [...leftImages];
                        next[idx] = { ...next[idx], alt: e.target.value };
                        setLeftImages(next);
                      }}
                      placeholder="Alt text"
                      className="flex-1 rounded border px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => moveSideImage("left", idx, "up")}
                      disabled={idx === 0}
                      className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                    >
                      &uarr;
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSideImage("left", idx, "down")}
                      disabled={idx === leftImages.length - 1}
                      className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                    >
                      &darr;
                    </button>
                    <button
                      type="button"
                      onClick={() => setLeftImages(leftImages.filter((_, i) => i !== idx))}
                      className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <ImageUploadButton
                  onUploaded={(publicId) => setLeftImages([...leftImages, { publicId }])}
                  folder="aroundtheworld50s/blog"
                />
              </div>
            </div>
          )}

          {rightType === "image" && (
            <div>
              <span className="mb-1 block text-sm font-medium">Right Images</span>
              <div className="space-y-2">
                {rightImages.map((img, idx) => (
                  <div key={img.publicId} className="flex items-center gap-2">
                    <Image
                      src={img.publicId}
                      alt={img.alt || "Right preview"}
                      width={48}
                      height={48}
                      className="rounded object-cover"
                      style={{ width: 48, height: "auto" }}
                    />
                    <input
                      type="text"
                      value={img.alt ?? ""}
                      onChange={(e) => {
                        const next = [...rightImages];
                        next[idx] = { ...next[idx], alt: e.target.value };
                        setRightImages(next);
                      }}
                      placeholder="Alt text"
                      className="flex-1 rounded border px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => moveSideImage("right", idx, "up")}
                      disabled={idx === 0}
                      className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                    >
                      &uarr;
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSideImage("right", idx, "down")}
                      disabled={idx === rightImages.length - 1}
                      className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                    >
                      &darr;
                    </button>
                    <button
                      type="button"
                      onClick={() => setRightImages(rightImages.filter((_, i) => i !== idx))}
                      className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <ImageUploadButton
                  onUploaded={(publicId) => setRightImages([...rightImages, { publicId }])}
                  folder="aroundtheworld50s/blog"
                />
              </div>
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
                  style={{ width: 48, height: "auto" }}
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
                  className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
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

      {/* Image carousel block */}
      {type === "image_carousel" && (
        <div>
          <span className="mb-1 block text-sm font-medium">Carousel Images (min 2)</span>
          <div className="space-y-2">
            {carouselImages.map((img, idx) => (
              <div key={img.publicId} className="flex items-center gap-2">
                <Image
                  src={img.publicId}
                  alt={img.caption || ""}
                  width={48}
                  height={48}
                  className="rounded object-cover"
                  style={{ width: 48, height: "auto" }}
                />
                <input
                  type="text"
                  value={img.caption ?? ""}
                  onChange={(e) => {
                    const next = [...carouselImages];
                    next[idx] = { ...next[idx], caption: e.target.value };
                    setCarouselImages(next);
                  }}
                  placeholder="Caption (optional)"
                  className="flex-1 rounded border px-2 py-1 text-sm"
                />
                <button
                  type="button"
                  onClick={() => moveCarouselImage(idx, "up")}
                  disabled={idx === 0}
                  className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                >
                  &uarr;
                </button>
                <button
                  type="button"
                  onClick={() => moveCarouselImage(idx, "down")}
                  disabled={idx === carouselImages.length - 1}
                  className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                >
                  &darr;
                </button>
                <button
                  type="button"
                  onClick={() => setCarouselImages(carouselImages.filter((_, i) => i !== idx))}
                  className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2">
            <ImageUploadButton
              onUploaded={(publicId) => setCarouselImages([...carouselImages, { publicId }])}
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

      {/* Social embed block */}
      {type === "social_embed" && (
        <div className="space-y-3">
          <div>
            <span className="mb-1 block text-sm font-medium">Platform</span>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 text-sm">
                <input
                  type="radio"
                  name="embed-platform"
                  value="instagram"
                  checked={embedPlatform === "instagram"}
                  onChange={() => {
                    setEmbedPlatform("instagram");
                    setShowEmbedPreview(false);
                  }}
                />
                Instagram
              </label>
              <label className="flex items-center gap-1.5 text-sm">
                <input
                  type="radio"
                  name="embed-platform"
                  value="tiktok"
                  checked={embedPlatform === "tiktok"}
                  onChange={() => {
                    setEmbedPlatform("tiktok");
                    setShowEmbedPreview(false);
                  }}
                />
                TikTok
              </label>
            </div>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Post URL</span>
            <input
              type="url"
              value={embedUrl}
              onChange={(e) => {
                setEmbedUrl(e.target.value);
                setShowEmbedPreview(false);
              }}
              placeholder={
                embedPlatform === "instagram"
                  ? "https://www.instagram.com/p/..."
                  : "https://www.tiktok.com/@.../video/..."
              }
              className="w-full rounded border px-3 py-2 text-sm"
              required
            />
          </label>

          <button
            type="button"
            onClick={() => setShowEmbedPreview(true)}
            disabled={!embedUrl}
            className="rounded bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            Preview Embed
          </button>

          {showEmbedPreview && embedUrl && (
            <div className="rounded border p-4 bg-gray-50">
              <SocialEmbedBlock data={{ platform: embedPlatform, url: embedUrl }} />
            </div>
          )}
        </div>
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
