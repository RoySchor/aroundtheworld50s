import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600">
        Welcome to the admin panel. Use the sidebar to manage content.
      </p>
    </div>
  );
}
