"use client";

import { LocationFlag } from "@/components/shared/LocationFlag";

interface CountryFlagProps {
  code: string;
  country: string;
  state?: string | null;
}

export function CountryFlag({ code, country, state }: CountryFlagProps) {
  return (
    <div className="tip-card-flag">
      <LocationFlag countryCode={code} state={state} alt={state ?? country} height="24" />
    </div>
  );
}
