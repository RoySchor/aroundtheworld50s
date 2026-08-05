"use client";

import { useEffect } from "react";
import { formatLocation } from "@/lib/format";
import { TipSection } from "@/components/tips/TipSection";
import type { TipSection as TipSectionType } from "@/server/db/schema";

interface TipPreviewModalProps {
  tip: {
    title: string;
    country: string;
    state: string | null;
    sections: TipSectionType[];
  };
  onClose: () => void;
}

export function TipPreviewModal({ tip, onClose }: TipPreviewModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const enabledSections = tip.sections.filter((s) => s.enabled);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tip preview"
      className="fixed inset-0 z-[200] overflow-y-auto bg-white"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between bg-gray-900 px-4 py-2 text-white">
        <span className="text-sm font-medium">Preview Mode</span>
        <button
          type="button"
          onClick={onClose}
          className="rounded bg-white/20 px-3 py-1 text-sm hover:bg-white/30"
        >
          Close Preview
        </button>
      </div>

      <div className="page-container mt-16">
        <div className="container">
          <div className="page-content">
            <div className="tip-detail-header">
              <div className="tip-detail-title-section">
                <h1 className="tip-detail-title">{tip.title}</h1>
                <p className="tip-detail-location">{formatLocation(tip)}</p>
              </div>
            </div>

            <div className="tip-detail-content">
              {enabledSections.map((section) => (
                <TipSection key={section.id} section={section} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
