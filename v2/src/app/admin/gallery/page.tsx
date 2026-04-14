import type { Metadata } from "next";
import { getAllGalleryImages } from "@/server/repositories/admin-gallery";
import { GalleryAdmin } from "@/components/admin/gallery/GalleryAdmin";

export const metadata: Metadata = {
  title: "Manage Gallery",
};

export default async function AdminGalleryPage() {
  const images = await getAllGalleryImages();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Gallery</h1>
      <GalleryAdmin images={images} />
    </div>
  );
}
