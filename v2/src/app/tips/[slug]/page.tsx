import type { Metadata } from "next";
import {
  getPublishedTips,
  getTipBySlug,
} from "@/server/repositories/tips";
import { TipSection } from "@/components/tips/TipSection";

interface TipDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tips = await getPublishedTips();
  return tips.map((tip) => ({ slug: tip.slug }));
}

export async function generateMetadata({
  params,
}: TipDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tip = await getTipBySlug(slug);

  if (!tip) return { title: "Tips Not Found" };

  return {
    title: tip.title,
    description: tip.description ?? undefined,
  };
}

function getLocation(tip: { state: string | null; country: string }) {
  return tip.state ? `${tip.state}, ${tip.country}` : tip.country;
}

export default async function TipDetailPage({ params }: TipDetailPageProps) {
  const { slug } = await params;
  const tip = await getTipBySlug(slug);

  if (!tip) {
    return (
      <div className="page-container mt-44">
        <div className="container">
          <div className="tip-not-found">
            <h1>Tips Not Found</h1>
            <p>
              The tips page for &ldquo;{slug}&rdquo; doesn&apos;t exist yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container mt-44">
      <div className="container">
        <div className="page-content">
          <div className="tip-detail-header">
            <div className="tip-detail-title-section">
              <h1 className="tip-detail-title">{tip.title}</h1>
              <p className="tip-detail-location">{getLocation(tip)}</p>
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
