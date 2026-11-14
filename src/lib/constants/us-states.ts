/**
 * US states + DC for the state dropdown on blog/tips forms.
 * Only relevant when countryCode is "US". `code` is the USPS abbreviation,
 * which also names the state's flag in `public/flags/us/`.
 */
export const US_STATES = [
  { label: "Alabama", value: "Alabama", code: "AL" },
  { label: "Alaska", value: "Alaska", code: "AK" },
  { label: "Arizona", value: "Arizona", code: "AZ" },
  { label: "Arkansas", value: "Arkansas", code: "AR" },
  { label: "California", value: "California", code: "CA" },
  { label: "Colorado", value: "Colorado", code: "CO" },
  { label: "Connecticut", value: "Connecticut", code: "CT" },
  { label: "Delaware", value: "Delaware", code: "DE" },
  { label: "Florida", value: "Florida", code: "FL" },
  { label: "Georgia", value: "Georgia", code: "GA" },
  { label: "Hawaii", value: "Hawaii", code: "HI" },
  { label: "Idaho", value: "Idaho", code: "ID" },
  { label: "Illinois", value: "Illinois", code: "IL" },
  { label: "Indiana", value: "Indiana", code: "IN" },
  { label: "Iowa", value: "Iowa", code: "IA" },
  { label: "Kansas", value: "Kansas", code: "KS" },
  { label: "Kentucky", value: "Kentucky", code: "KY" },
  { label: "Louisiana", value: "Louisiana", code: "LA" },
  { label: "Maine", value: "Maine", code: "ME" },
  { label: "Maryland", value: "Maryland", code: "MD" },
  { label: "Massachusetts", value: "Massachusetts", code: "MA" },
  { label: "Michigan", value: "Michigan", code: "MI" },
  { label: "Minnesota", value: "Minnesota", code: "MN" },
  { label: "Mississippi", value: "Mississippi", code: "MS" },
  { label: "Missouri", value: "Missouri", code: "MO" },
  { label: "Montana", value: "Montana", code: "MT" },
  { label: "Nebraska", value: "Nebraska", code: "NE" },
  { label: "Nevada", value: "Nevada", code: "NV" },
  { label: "New Hampshire", value: "New Hampshire", code: "NH" },
  { label: "New Jersey", value: "New Jersey", code: "NJ" },
  { label: "New Mexico", value: "New Mexico", code: "NM" },
  { label: "New York", value: "New York", code: "NY" },
  { label: "North Carolina", value: "North Carolina", code: "NC" },
  { label: "North Dakota", value: "North Dakota", code: "ND" },
  { label: "Ohio", value: "Ohio", code: "OH" },
  { label: "Oklahoma", value: "Oklahoma", code: "OK" },
  { label: "Oregon", value: "Oregon", code: "OR" },
  { label: "Pennsylvania", value: "Pennsylvania", code: "PA" },
  { label: "Rhode Island", value: "Rhode Island", code: "RI" },
  { label: "South Carolina", value: "South Carolina", code: "SC" },
  { label: "South Dakota", value: "South Dakota", code: "SD" },
  { label: "Tennessee", value: "Tennessee", code: "TN" },
  { label: "Texas", value: "Texas", code: "TX" },
  { label: "Utah", value: "Utah", code: "UT" },
  { label: "Vermont", value: "Vermont", code: "VT" },
  { label: "Virginia", value: "Virginia", code: "VA" },
  { label: "Washington", value: "Washington", code: "WA" },
  { label: "Washington DC", value: "Washington DC", code: "DC" },
  { label: "West Virginia", value: "West Virginia", code: "WV" },
  { label: "Wisconsin", value: "Wisconsin", code: "WI" },
  { label: "Wyoming", value: "Wyoming", code: "WY" },
] as const;

const STATE_CODES = new Map<string, string>(US_STATES.map((s) => [s.value, s.code]));

// Flags are vendored from flagcdn.com, which has no DC flag; DC falls back to the US flag.
const STATES_WITHOUT_FLAG = new Set(["DC"]);

/** Path to a state's flag image (e.g. "New York" → "/flags/us/ny.png"), or undefined. */
export function getStateFlagSrc(state: string): string | undefined {
  const code = STATE_CODES.get(state);
  if (!code || STATES_WITHOUT_FLAG.has(code)) return undefined;
  return `/flags/us/${code.toLowerCase()}.png`;
}
