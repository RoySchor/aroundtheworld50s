import { sanitizeHtml } from "@/lib/sanitize";
import type { TextBlockData } from "@/types/blog";

interface TextBlockProps {
  data: TextBlockData;
}

export function TextBlock({ data }: TextBlockProps) {
  return (
    <div
      className="post-description"
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.html) }}
    />
  );
}
