import Image from "next/image";
import Link from "next/link";
import { formatBlogDate, formatBlogDateWithYear } from "@/lib/format";
import type { BlogPost } from "@/server/db/schema";

interface BlogCardProps {
  post: BlogPost;
  showYear?: boolean;
}

export function BlogCard({ post, showYear = false }: BlogCardProps) {
  const dateStr = post.publishedAt ?? post.createdAt;
  const formattedDate = showYear ? formatBlogDateWithYear(dateStr) : formatBlogDate(dateStr);

  return (
    <div className="flex justify-center">
      <Link href={`/blog/${post.countrySlug}/${post.postIndex}`} className="group block w-full">
        {/* Outer wrapper — matches v1 .blog-item (transparent border = spacing) */}
        <div className="border-[0.5em] border-transparent overflow-hidden w-full">
          {/* Inner wrapper — matches v1 .blog-image-wrapper (border turns teal on hover) */}
          <div className="p-[0.5em] border-[0.5em] border-transparent group-hover:border-teal-accent transition-colors duration-300 w-full">
            <div className="text-sm sm:text-base font-bold mb-2 text-center">{post.title}</div>
            {showYear && (
              <div className="text-base text-gray-500 mb-2 text-center">{formattedDate}</div>
            )}
            <div className="relative w-full h-[200px] sm:h-[275px] overflow-hidden">
              {post.backgroundImage && (
                <Image
                  src={post.backgroundImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[rgba(131,197,190,0.7)] z-10">
                <p className="text-white text-xl font-bold text-center px-5 py-2.5">
                  {post.excerpt}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Date below the bordered area — matches v1 .blog-date position */}
        {!showYear && (
          <div className="text-base text-gray-500 mt-1 text-center">{formattedDate}</div>
        )}
      </Link>
    </div>
  );
}
