"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DestinationDropdownProps {
  locations: { displayName: string; countrySlug: string }[];
}

export function DestinationDropdown({ locations }: DestinationDropdownProps) {
  const router = useRouter();
  const selectRef = useRef<HTMLSelectElement>(null);

  // Reset to default option on mount (handles browser bfcache restoring old value)
  useEffect(() => {
    if (selectRef.current) selectRef.current.value = "";
  }, []);

  return (
    <div className="dropdown-container">
      <select
        ref={selectRef}
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
