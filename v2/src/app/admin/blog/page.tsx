import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Blog Posts",
};

export default function AdminBlogPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Blog Posts</h1>
      <p className="text-gray-600">Blog post management coming in Phase 2.5.</p>
    </div>
  );
}
