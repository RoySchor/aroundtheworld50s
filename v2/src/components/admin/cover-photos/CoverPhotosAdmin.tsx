"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImageUploadButton } from "@/components/admin/ImageUploadButton";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  setCoverOverride,
  removeCoverOverride,
} from "@/server/actions/cover-photos";
import type { CountryWithCover } from "@/server/repositories/cover-photos";

interface CoverPhotosAdminProps {
  countries: CountryWithCover[];
}

export function CoverPhotosAdmin({ countries }: CoverPhotosAdminProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [resetTarget, setResetTarget] = useState<CountryWithCover | null>(null);

  function displayName(c: CountryWithCover) {
    return c.state ? `${c.state}, ${c.country}` : c.country;
  }

  function handleUpload(countrySlug: string, publicId: string) {
    setError(null);
    startTransition(async () => {
      const result = await setCoverOverride(countrySlug, publicId);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  function handleReset(country: CountryWithCover) {
    setResetTarget(country);
  }

  function confirmReset() {
    if (!resetTarget) return;
    const slug = resetTarget.countrySlug;
    setResetTarget(null);
    setError(null);
    startTransition(async () => {
      const result = await removeCoverOverride(slug);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  if (countries.length === 0) {
    return (
      <p className="text-gray-500">
        No countries with published blogs yet.
      </p>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((c) => {
          const cover = c.overrideCover ?? c.defaultCover;
          const isCustom = !!c.overrideCover;

          return (
            <div
              key={c.countrySlug}
              className="overflow-hidden rounded-lg border bg-white shadow-sm"
            >
              <div className="relative aspect-[16/9] bg-gray-100">
                {cover ? (
                  <Image
                    src={cover}
                    alt={displayName(c)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    No cover photo
                  </div>
                )}
                <span
                  className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                    isCustom
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {isCustom ? "Custom" : "Default"}
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900">
                  {displayName(c)}
                </h3>
                <div className="mt-3 flex items-center gap-2">
                  <ImageUploadButton
                    onUploaded={(publicId) =>
                      handleUpload(c.countrySlug, publicId)
                    }
                    folder={`aroundtheworld50s/covers/${c.countrySlug}`}
                  />
                  {isCustom && (
                    <button
                      type="button"
                      onClick={() => handleReset(c)}
                      disabled={isPending}
                      className="rounded px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Reset to Default
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {resetTarget && (
        <ConfirmDialog
          title="Reset Cover Photo"
          message={`Remove the custom cover photo for ${displayName(resetTarget)}? It will revert to using the latest blog's cover photo.`}
          confirmLabel="Reset"
          onConfirm={confirmReset}
          onCancel={() => setResetTarget(null)}
        />
      )}
    </>
  );
}
