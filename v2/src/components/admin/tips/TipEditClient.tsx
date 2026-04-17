"use client";

import { useCallback, useState } from "react";
import { TipStatusBar } from "@/components/admin/tips/TipStatusBar";
import { TipMetadataForm } from "@/components/admin/tips/TipMetadataForm";
import type { TipMetadataState } from "@/components/admin/tips/TipMetadataForm";
import { TipSectionsEditor } from "@/components/admin/tips/TipSectionsEditor";
import { TipPreviewModal } from "@/components/admin/tips/TipPreviewModal";
import type { Tip, TipSection } from "@/server/db/schema";

interface TipEditClientProps {
  tip: Tip & { sections: TipSection[] };
}

export function TipEditClient({ tip }: TipEditClientProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [metadata, setMetadata] = useState<TipMetadataState>({
    title: tip.title,
    description: tip.description ?? "",
    state: tip.state ?? "",
  });
  const [sectionDrafts, setSectionDrafts] = useState<Record<string, string>>(
    {},
  );
  const [titleDrafts, setTitleDrafts] = useState<Record<string, string>>({});

  const handleMetadataChange = useCallback((state: TipMetadataState) => {
    setMetadata(state);
  }, []);

  const handleDraftsChange = useCallback(
    (drafts: Record<string, string>) => {
      setSectionDrafts(drafts);
    },
    [],
  );

  const handleTitleDraftsChange = useCallback(
    (drafts: Record<string, string>) => {
      setTitleDrafts(drafts);
    },
    [],
  );

  const previewTip = {
    title: metadata.title,
    country: tip.country,
    state: metadata.state || null,
    sections: tip.sections.map((s) => ({
      ...s,
      content: sectionDrafts[s.id] ?? s.content,
      title: titleDrafts[s.id] ?? s.title,
    })),
  };

  return (
    <>
      <div className="sticky top-0 z-10 -mx-8 bg-gray-50 px-8 pb-4 pt-8 shadow-sm">
        <TipStatusBar
          tipId={tip.id}
          status={tip.status}
          slug={tip.slug}
          onPreview={() => setPreviewOpen(true)}
        />
      </div>

      <TipMetadataForm tip={tip} onStateChange={handleMetadataChange} />

      <hr />

      <TipSectionsEditor
        sections={tip.sections}
        onDraftsChange={handleDraftsChange}
        onTitleDraftsChange={handleTitleDraftsChange}
      />

      {previewOpen && (
        <TipPreviewModal
          tip={previewTip}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
}
