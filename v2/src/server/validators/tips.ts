import "server-only";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Enum schemas (mirror Drizzle pgEnums)
// ---------------------------------------------------------------------------

const publishStatusSchema = z.enum(["draft", "published"]);

export const tipSectionKeySchema = z.enum([
  "essential_tips",
  "budget_planning",
  "food_dining",
  "transportation",
  "accommodation",
  "safety_health",
]);

// ---------------------------------------------------------------------------
// Tip schemas
// ---------------------------------------------------------------------------

export const createTipSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens",
    ),
  country: z.string().min(1, "Country is required"),
  countryCode: z.string().min(2).max(3),
  state: z.string().nullable().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  status: publishStatusSchema.optional().default("draft"),
});

export const updateTipSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  state: z.string().nullable().optional(),
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
});

// ---------------------------------------------------------------------------
// Tip section schemas
// ---------------------------------------------------------------------------

export const createTipSectionSchema = z.object({
  sectionKey: tipSectionKeySchema,
  content: z.string().nullable().optional(),
  enabled: z.boolean().optional().default(true),
});

export const updateTipSectionSchema = z.object({
  content: z.string().nullable().optional(),
  enabled: z.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Exported types
// ---------------------------------------------------------------------------

export type TipSectionKey = z.infer<typeof tipSectionKeySchema>;
export type CreateTipInput = z.infer<typeof createTipSchema>;
export type UpdateTipInput = z.infer<typeof updateTipSchema>;
export type CreateTipSectionInput = z.infer<typeof createTipSectionSchema>;
export type UpdateTipSectionInput = z.infer<typeof updateTipSectionSchema>;
