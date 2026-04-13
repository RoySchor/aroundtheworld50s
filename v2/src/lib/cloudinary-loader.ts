"use client";

import {
  CLOUDINARY_BASE_URL,
} from "@/lib/constants";

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const transforms = quality
    ? `f_auto,w_${width},q_${quality}`
    : `f_auto,q_auto,w_${width}`;
  return `${CLOUDINARY_BASE_URL}/${transforms}/${src}`;
}
