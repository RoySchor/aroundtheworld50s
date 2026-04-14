import type { Metadata } from "next";
import { CreatePostForm } from "@/components/admin/blog/CreatePostForm";

export const metadata: Metadata = {
  title: "Create Blog Post",
};

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Create New Post</h1>
      <CreatePostForm />
    </div>
  );
}
