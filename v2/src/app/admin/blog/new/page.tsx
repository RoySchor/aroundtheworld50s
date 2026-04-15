import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreatePostForm } from "@/components/admin/blog/CreatePostForm";

export const metadata: Metadata = {
  title: "Create Blog Post",
};

export default function NewBlogPostPage() {
  return (
    <div>
      <Link
        href="/admin/blog"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft size={16} />
        Back to Blog Posts
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Create New Post</h1>
      <CreatePostForm />
    </div>
  );
}
