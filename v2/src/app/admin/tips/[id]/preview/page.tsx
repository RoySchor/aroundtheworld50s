import { notFound } from "next/navigation";
import { getTipById } from "@/server/repositories/admin-tips";
import { formatLocation } from "@/lib/format";
import { TipSection } from "@/components/tips/TipSection";

export const dynamic = "force-dynamic";

export default async function TipPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tip = await getTipById(id);

  if (!tip) notFound();

  // Filter to enabled sections only (matching public page behavior)
  const enabledSections = tip.sections.filter((s) => s.enabled);

  return (
    <div className="page-container mt-44">
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
  );
}
