"use client";

import { useRouter } from "next/navigation";

interface DestinationDropdownProps {
  locations: { displayName: string; countrySlug: string }[];
}

export function DestinationDropdown({ locations }: DestinationDropdownProps) {
  const router = useRouter();

  return (
    <div className="dropdown-container">
      <select
        className="destination-dropdown"
        onChange={(e) => {
          if (e.target.value) {
            router.push(`/blog/${e.target.value}`);
          }
        }}
      >
        <option value="">Destinations</option>
        {locations.map((location) => (
          <option key={location.countrySlug} value={location.countrySlug}>
            {location.displayName}
          </option>
        ))}
      </select>
    </div>
  );
}
