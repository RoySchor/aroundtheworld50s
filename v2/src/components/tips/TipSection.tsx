import { sanitizeHtml } from "@/lib/sanitize";
import {
  TIP_SECTION_LABELS,
  TIP_EMPTY_PLACEHOLDER,
} from "@/lib/constants/tip-sections";
import type { TipSection as TipSectionType } from "@/server/db/schema";

interface TipSectionProps {
  section: TipSectionType;
}

export function TipSection({ section }: TipSectionProps) {
  const label = TIP_SECTION_LABELS[section.sectionKey] ?? section.sectionKey;
  const hasContent = section.content && section.content.trim().length > 0;

  return (
    <div className="tip-section">
      <h2>{label}</h2>

      {hasContent ? (
        <div
          className="tip-content"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(section.content!),
          }}
        />
      ) : (
        <div className="tip-placeholder">
          <p>{TIP_EMPTY_PLACEHOLDER}</p>
        </div>
      )}
    </div>
  );
}
