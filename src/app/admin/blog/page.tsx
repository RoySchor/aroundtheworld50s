import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/server/repositories/admin-blog";

export const metadata: Metadata = {
  title: "Manage Blog Posts",
};

export default async function AdminBlogPage() {
  const posts = await getAllPosts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500">No blog posts yet. Create your first one!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{post.title}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {post.country}
                    {post.state ? ` (${post.state})` : ""}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        post.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{post.updatedAt.toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/blog/${post.id}`} className="text-blue-600 hover:underline">
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
