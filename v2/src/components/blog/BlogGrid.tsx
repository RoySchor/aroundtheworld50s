import type { BlogPost } from "@/server/db/schema";
import { BlogCard } from "./BlogCard";

interface BlogGridProps {
  posts: BlogPost[];
  showYear?: boolean;
}

export function BlogGrid({ posts, showYear = false }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} showYear={showYear} />
      ))}
    </div>
  );
}
