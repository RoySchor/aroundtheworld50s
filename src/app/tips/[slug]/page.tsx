import type { Metadata } from "next";
import { getTipBySlug } from "@/server/repositories/tips";
import { formatLocation } from "@/lib/format";
import { TipSection } from "@/components/tips/TipSection";

interface TipDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: TipDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tip = await getTipBySlug(slug);

  if (!tip) return { title: "Tip Not Found" };

  return {
    title: tip.title,
    description: tip.description ?? undefined,
  };
}

export default async function TipDetailPage({ params }: TipDetailPageProps) {
  const { slug } = await params;
  const tip = await getTipBySlug(slug);

  if (!tip) {
    return (
      <div className="page-container mt-28 lg:mt-44">
        <div className="container">
          <div className="tip-not-found">
            <h1>Tips Not Found</h1>
            <p>The tips page for &ldquo;{slug}&rdquo; doesn&apos;t exist yet.</p>
          </div>
        </div>
      </div>
    );
  }

  // Sections come from the DB (enabled only, ordered by position). If the seed
  // or future admin CRUD doesn't create all 6 section rows for a tip, missing
  // sections simply won't render — no placeholder appears. Phase 2 admin will
  // ensure all 6 rows are created on tip creation.
  return (
    <div className="page-container mt-28 lg:mt-44">
      <div className="container">
        <div className="page-content">
          <div className="tip-detail-header">
            <div className="tip-detail-title-section">
              <h1 className="tip-detail-title">{tip.title}</h1>
              <p className="tip-detail-location">{formatLocation(tip)}</p>
            </div>
          </div>

          <div className="tip-detail-content">
            {tip.sections.map((section) => (
              <TipSection key={section.id} section={section} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
