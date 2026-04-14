import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Gallery",
};

export default function AdminGalleryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gallery</h1>
      <p className="text-gray-600">Gallery management coming in Phase 2.7.</p>
    </div>
  );
}
