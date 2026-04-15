import type { Metadata } from "next";
import { getPublishedTips } from "@/server/repositories/tips";

export const dynamic = "force-dynamic";
import { TipCard } from "@/components/tips/TipCard";

export const metadata: Metadata = {
  title: "Tips",
  description:
    "Practical travel tips and advice from our experiences around the world.",
};

export default async function TipsListingPage() {
  const tips = await getPublishedTips();

  return (
    <div className="page-container mt-44">
      <div className="container">
        <div className="page-content text-center">
          <h1 className="page-title">Travel Tips by Destination</h1>
          <p className="tips-page-subtitle">
            Discover insider tips and essential information for your next
            adventure
          </p>
          <div className="tips-grid">
            {tips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
