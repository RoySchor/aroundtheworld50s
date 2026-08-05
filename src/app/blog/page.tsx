import type { Metadata } from "next";
import { getPublishedPosts } from "@/server/repositories/blog";

export const dynamic = "force-dynamic";
import { BlogGrid } from "@/components/blog/BlogGrid";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read our travel stories and adventures from around the world.",
};

export default async function BlogListingPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="page-container mt-28 lg:mt-44">
      <div className="container">
        <div className="page-content text-center mb-8">
          <h1 className="page-title">Blog</h1>
          <BlogGrid posts={posts} />
        </div>
      </div>
    </div>
  );
}
