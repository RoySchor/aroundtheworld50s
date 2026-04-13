import Link from "next/link";
import type { Tip } from "@/server/db/schema";
import { formatLocation } from "@/lib/format";
import { CountryFlag } from "./CountryFlag";

interface TipCardProps {
  tip: Tip;
}

export function TipCard({ tip }: TipCardProps) {
  return (
    <Link href={`/tips/${tip.slug}`} className="tip-card">
      <div className="tip-card-header">
        <CountryFlag code={tip.countryCode} country={tip.country} />
        <div>
          <h2 className="tip-card-title">{tip.title}</h2>
          <p className="tip-card-location">{formatLocation(tip)}</p>
        </div>
      </div>
      {tip.description && (
        <p className="tip-card-description">{tip.description}</p>
      )}
    </Link>
  );
}
