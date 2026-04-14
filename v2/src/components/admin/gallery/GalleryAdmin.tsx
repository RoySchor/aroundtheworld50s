"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { uploadImage } from "@/server/actions/upload";
import {
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  reorderGalleryImage,
} from "@/server/actions/gallery";
import type { GalleryImage } from "@/server/db/schema";

interface GalleryAdminProps {
  images: GalleryImage[];
}

export function GalleryAdmin({ images }: GalleryAdminProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Upload state
  const fileRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState("");

  // Inline caption editing
  const [captions, setCaptions] = useState<Record<string, string>>({});

  function getCaption(img: GalleryImage) {
    return captions[img.id] ?? img.caption ?? "";
  }

  function setCaptionDraft(id: string, value: string) {
    setCaptions((prev) => ({ ...prev, [id]: value }));
  }

  function handleUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", "aroundtheworld50s/gallery");

    startTransition(async () => {
      // Step 1: Upload to Cloudinary
      const uploadResult = await uploadImage(formData);
      if (!uploadResult.success) {
        setError(uploadResult.error);
        return;
      }

      // Step 2: Create DB row
      const createResult = await createGalleryImage({
        cloudinaryPublicId: uploadResult.data.publicId,
        caption: caption || null,
      });

      if (createResult.success) {
        setCaption("");
        if (fileRef.current) fileRef.current.value = "";
        setSuccess("Image added to gallery");
        router.refresh();
      } else {
        setError(createResult.error);
      }
    });
  }

  function handleSaveCaption(id: string) {
    setError(null);
    setSuccess(null);
    const img = images.find((i) => i.id === id);
    const newCaption = captions[id] ?? img?.caption ?? null;
    startTransition(async () => {
      const result = await updateGalleryImage(id, { caption: newCaption });
      if (result.success) {
        setSuccess("Caption saved");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this image? It will also be removed from Cloudinary.")) {
      return;
    }
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await deleteGalleryImage(id);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  function handleReorder(id: string, direction: "up" | "down") {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await reorderGalleryImage(id, direction);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="space-y-8">
      {/* Status messages */}
      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Upload section */}
      <div className="rounded border bg-gray-50 p-5">
        <h2 className="mb-4 text-lg font-semibold">Add Image</h2>
        <div className="flex flex-wrap items-end gap-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Image *</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="text-sm"
            />
          </label>
          <label className="block flex-1">
            <span className="mb-1 block text-sm font-medium">Caption</span>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm"
              placeholder="Optional caption"
            />
          </label>
          <button
            type="button"
            onClick={handleUpload}
            disabled={isPending}
            className="rounded bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {/* Image grid */}
      {images.length === 0 ? (
        <p className="text-gray-500">No gallery images yet. Upload your first one!</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, idx) => (
            <div key={img.id} className="rounded border bg-white">
              {/* Thumbnail */}
              <div className="relative aspect-[4/3]">
                <Image
                  src={img.cloudinaryPublicId}
                  alt={img.caption ?? `Gallery image ${idx + 1}`}
                  fill
                  className="rounded-t object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
                  #{idx + 1}
                </span>
              </div>

              {/* Controls */}
              <div className="space-y-3 p-3">
                {/* Caption input + save */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={getCaption(img)}
                    onChange={(e) => setCaptionDraft(img.id, e.target.value)}
                    className="flex-1 rounded border px-2 py-1 text-sm"
                    placeholder="Caption"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveCaption(img.id)}
                    disabled={isPending}
                    className="rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>

                {/* Reorder + delete */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleReorder(img.id, "up")}
                    disabled={isPending || idx === 0}
                    className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                    title="Move up"
                  >
                    &larr;
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReorder(img.id, "down")}
                    disabled={isPending || idx === images.length - 1}
                    className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                    title="Move down"
                  >
                    &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(img.id)}
                    disabled={isPending}
                    className="ml-auto rounded px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
