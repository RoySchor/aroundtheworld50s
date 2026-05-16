import Link from "next/link";
import { sanitizeHtml } from "@/lib/sanitize";

interface TipsCtaProps {
  ctaCopy: string;
  tipsSlug: string;
}

export function TipsCta({ ctaCopy, tipsSlug }: TipsCtaProps) {
  return (
    <div className="post-bolded-text post-tips-section-container">
      <Link href={`/tips/${tipsSlug}`} className="post-tips-link">
        <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(ctaCopy) }} />
      </Link>
    </div>
  );
}
