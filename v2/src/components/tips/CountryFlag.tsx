"use client";

import Flag from "react-world-flags";

interface CountryFlagProps {
  code: string;
  country: string;
}

export function CountryFlag({ code, country }: CountryFlagProps) {
  return (
    <div className="tip-card-flag">
      <Flag code={code} alt={country} height="24" />
    </div>
  );
}
