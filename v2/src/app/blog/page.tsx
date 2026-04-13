import type { Metadata } from "next";
import { getPublishedPosts } from "@/server/repositories/blog";
import { BlogGrid } from "@/components/blog/BlogGrid";

export const metadata: Metadata = {
  title: "Blog",
};

export default async function BlogListingPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="page-container mt-44">
      <div className="container">
        <div className="page-content">
          <h1 className="page-title">Blog</h1>
          <BlogGrid posts={posts} />
        </div>
      </div>
    </div>
  );
}
