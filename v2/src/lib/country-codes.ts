/**
 * Static country name → ISO 3166-1 alpha-2 code lookup.
 * Covers countries featured on the blog. Add more as needed.
 */
const COUNTRY_CODES: Record<string, string> = {
  "afghanistan": "AF",
  "argentina": "AR",
  "australia": "AU",
  "austria": "AT",
  "belgium": "BE",
  "brazil": "BR",
  "cambodia": "KH",
  "canada": "CA",
  "chile": "CL",
  "china": "CN",
  "colombia": "CO",
  "costa rica": "CR",
  "croatia": "HR",
  "cuba": "CU",
  "czech republic": "CZ",
  "czechia": "CZ",
  "denmark": "DK",
  "dominican republic": "DO",
  "ecuador": "EC",
  "egypt": "EG",
  "england": "GB",
  "ethiopia": "ET",
  "fiji": "FJ",
  "finland": "FI",
  "france": "FR",
  "germany": "DE",
  "greece": "GR",
  "guatemala": "GT",
  "hungary": "HU",
  "iceland": "IS",
  "india": "IN",
  "indonesia": "ID",
  "ireland": "IE",
  "israel": "IL",
  "italy": "IT",
  "jamaica": "JM",
  "japan": "JP",
  "jordan": "JO",
  "kenya": "KE",
  "laos": "LA",
  "malaysia": "MY",
  "maldives": "MV",
  "mexico": "MX",
  "morocco": "MA",
  "myanmar": "MM",
  "nepal": "NP",
  "netherlands": "NL",
  "new zealand": "NZ",
  "nicaragua": "NI",
  "norway": "NO",
  "oman": "OM",
  "panama": "PA",
  "peru": "PE",
  "philippines": "PH",
  "poland": "PL",
  "portugal": "PT",
  "romania": "RO",
  "scotland": "GB",
  "singapore": "SG",
  "south africa": "ZA",
  "south korea": "KR",
  "spain": "ES",
  "sri lanka": "LK",
  "sweden": "SE",
  "switzerland": "CH",
  "taiwan": "TW",
  "tanzania": "TZ",
  "thailand": "TH",
  "trinidad and tobago": "TT",
  "turkey": "TR",
  "turkiye": "TR",
  "united arab emirates": "AE",
  "uae": "AE",
  "united kingdom": "GB",
  "uk": "GB",
  "united states": "US",
  "usa": "US",
  "uruguay": "UY",
  "vietnam": "VN",
};

export function getCountryCode(countryName: string): string | undefined {
  return COUNTRY_CODES[countryName.toLowerCase().trim()];
}

/** Aliases to skip when building the canonical COUNTRIES list. */
const ALIAS_KEYS = new Set([
  "england",
  "scotland",
  "uk",
  "usa",
  "uae",
  "czechia",
  "turkiye",
]);

function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Sorted, deduplicated list of countries for combobox usage.
 * Each entry has a display label and ISO country code.
 */
export const COUNTRIES: { label: string; code: string }[] = Object.entries(
  COUNTRY_CODES,
)
  .filter(([key]) => !ALIAS_KEYS.has(key))
  .map(([key, code]) => ({ label: titleCase(key), code }))
  .sort((a, b) => a.label.localeCompare(b.label));
