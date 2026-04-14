import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Tips",
};

export default function AdminTipsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tips</h1>
      <p className="text-gray-600">Tips management coming in Phase 2.6.</p>
    </div>
  );
}
