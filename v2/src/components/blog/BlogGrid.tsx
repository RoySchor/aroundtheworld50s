import type { BlogPost } from "@/server/db/schema";
import { BlogCard } from "./BlogCard";

const LG_COLS: Record<number, string> = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

interface BlogGridProps {
  posts: BlogPost[];
  showYear?: boolean;
  columns?: 3 | 4;
}

export function BlogGrid({ posts, showYear = false, columns = 3 }: BlogGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${LG_COLS[columns]} gap-4`}>
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} showYear={showYear} />
      ))}
    </div>
  );
}
