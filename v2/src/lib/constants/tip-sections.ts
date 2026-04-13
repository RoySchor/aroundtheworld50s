export interface TipSectionMeta {
  key: string;
  label: string;
}

export const TIP_SECTIONS: TipSectionMeta[] = [
  { key: "essential_tips", label: "\u{1F3AF} Essential Tips" },
  { key: "budget_planning", label: "\u{1F4B0} Budget Planning" },
  { key: "food_dining", label: "\u{1F37D}\uFE0F Food & Dining" },
  { key: "transportation", label: "\u{1F697} Transportation" },
  { key: "accommodation", label: "\u{1F3E8} Accommodation" },
  { key: "safety_health", label: "\u26A0\uFE0F Safety & Health" },
];

export const TIP_SECTION_LABELS: Record<string, string> = Object.fromEntries(
  TIP_SECTIONS.map((s) => [s.key, s.label]),
);

export const TIP_EMPTY_PLACEHOLDER =
  "This page will be automatically populated with practical travel advice, local insights, and insider tips.";
