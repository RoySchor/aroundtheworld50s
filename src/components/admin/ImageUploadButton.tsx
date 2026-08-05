"use client";

import { useRef, useState, useTransition } from "react";
import { uploadImage } from "@/server/actions/upload";

interface ImageUploadButtonProps {
  onUploaded: (publicId: string) => void;
  folder?: string;
  className?: string;
}

export function ImageUploadButton({ onUploaded, folder, className }: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB. Please choose a smaller file.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const formData = new FormData();
    formData.set("file", file);
    if (folder) formData.set("folder", folder);

    startTransition(async () => {
      try {
        const result = await uploadImage(formData);
        if (result.success) {
          onUploaded(result.data.publicId);
        } else {
          setError(result.error);
        }
      } catch {
        setError("Upload failed. The image may be too large — try a smaller file.");
      }
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        className={
          className ??
          "rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        }
      >
        {isPending ? "Uploading..." : "Upload Image"}
      </button>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
