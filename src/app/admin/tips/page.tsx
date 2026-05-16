import type { Metadata } from "next";
import Link from "next/link";
import { getAllTips } from "@/server/repositories/admin-tips";

export const metadata: Metadata = {
  title: "Manage Tips",
};

export default async function AdminTipsPage() {
  const tipsList = await getAllTips();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tips</h1>
        <Link
          href="/admin/tips/new"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New Tip
        </Link>
      </div>

      {tipsList.length === 0 ? (
        <p className="text-gray-500">No tips yet. Create your first one!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {tipsList.map((tip) => (
                <tr key={tip.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{tip.title}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {tip.country}
                    {tip.state ? ` (${tip.state})` : ""}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {tip.slug}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        tip.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {tip.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {tip.updatedAt.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/tips/${tip.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
