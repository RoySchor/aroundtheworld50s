import Link from "next/link";
import type { Tip } from "@/server/db/schema";
import { CountryFlag } from "./CountryFlag";

interface TipCardProps {
  tip: Tip;
}

function getLocation(tip: { state: string | null; country: string }) {
  return tip.state ? `${tip.state}, ${tip.country}` : tip.country;
}

export function TipCard({ tip }: TipCardProps) {
  return (
    <Link href={`/tips/${tip.slug}`} className="tip-card">
      <div className="tip-card-header">
        <CountryFlag code={tip.countryCode} country={tip.country} />
        <div>
          <h2 className="tip-card-title">{tip.title}</h2>
          <p className="tip-card-location">{getLocation(tip)}</p>
        </div>
      </div>
      {tip.description && (
        <p className="tip-card-description">{tip.description}</p>
      )}
    </Link>
  );
}
