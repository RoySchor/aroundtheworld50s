// List of US states and territories
export const US_STATES = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
  // Special regions
  "New England": "NE_REGION",
  "District of Columbia": "DC",
  "Puerto Rico": "PR",
};

// List of states in New England
export const NEW_ENGLAND_STATES = [
  "Connecticut",
  "Maine",
  "Massachusetts",
  "New Hampshire",
  "Rhode Island",
  "Vermont",
];

// Function to normalize state name
export const normalizeStateName = (input) => {
  if (!input) return "";

  // Convert to title case and trim
  const normalized = input
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .trim();

  // Handle special cases
  if (normalized === "Dc" || normalized === "D.c." || normalized === "D.c") {
    return "District of Columbia";
  }

  return normalized;
};

// Function to validate state name
export const validateState = (input) => {
  if (!input) {
    return {
      isValid: false,
      message: "State name is required",
      normalizedName: "",
    };
  }

  const normalizedInput = normalizeStateName(input);

  // Check if it's a valid state
  if (US_STATES[normalizedInput]) {
    return {
      isValid: true,
      message: `✓ Valid state (${US_STATES[normalizedInput]})`,
      normalizedName: normalizedInput,
    };
  }

  // Check if it's a New England state
  if (normalizedInput === "New England") {
    return {
      isValid: true,
      message: "✓ New England region (includes CT, ME, MA, NH, RI, VT)",
      normalizedName: normalizedInput,
    };
  }

  // Try to find a matching state
  const possibleStates = Object.keys(US_STATES).filter(
    (state) =>
      state.toLowerCase().includes(normalizedInput.toLowerCase()) ||
      normalizedInput.toLowerCase().includes(state.toLowerCase()),
  );

  if (possibleStates.length > 0) {
    return {
      isValid: false,
      message: `Did you mean: ${possibleStates.join(", ")}?`,
      normalizedName: normalizedInput,
    };
  }

  return {
    isValid: false,
    message: "⚠️ Invalid state name. Please enter a valid US state.",
    normalizedName: normalizedInput,
  };
};
