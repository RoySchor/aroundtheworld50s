import type { Metadata } from "next";
import { getAuthenticatedAdmin } from "@/server/auth";
import { signOut } from "@/server/auth/actions";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const profile = await getAuthenticatedAdmin();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Logged in as {profile.displayName ?? "Admin"}
        </p>
        <form action={signOut}>
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
