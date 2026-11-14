import { US_STATES } from "@/lib/constants/us-states";

type StateOption = { label: string; value: string };

/**
 * Mexican states we have posts for. Cancun and Tulum are both in Quintana Roo.
 * Mexico City is a federal entity rather than a state, but works the same way here.
 */
export const MEXICO_STATES: readonly StateOption[] = [
  { label: "Mexico City", value: "Mexico City" },
  { label: "Quintana Roo (Cancun, Tulum)", value: "Quintana Roo" },
];

/**
 * Countries whose posts and tips are grouped per state (separate blog page,
 * tips page, and map pin), keyed by ISO country code.
 */
const STATES_BY_COUNTRY: Record<string, readonly StateOption[]> = {
  US: US_STATES,
  MX: MEXICO_STATES,
};

/** State options for a country, or an empty list if the country isn't split by state. */
export function getCountryStates(countryCode: string): readonly StateOption[] {
  return STATES_BY_COUNTRY[countryCode.toUpperCase()] ?? [];
}

export function hasCountryStates(countryCode: string): boolean {
  return getCountryStates(countryCode).length > 0;
}
