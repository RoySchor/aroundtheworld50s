import "server-only";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Enum schemas (mirror Drizzle pgEnums)
// ---------------------------------------------------------------------------

const publishStatusSchema = z.enum(["draft", "published"]);

// ---------------------------------------------------------------------------
// Block data field objects (no `type` — used for renderer type inference)
// ---------------------------------------------------------------------------

const textBlockFields = {
  html: z.string().min(1, "Text block content is required"),
};

const twoColumnBlockFields = {
  leftType: z.enum(["image", "text"]),
  rightType: z.enum(["image", "text"]),
  leftImage: z.string().optional(),
  leftImageAlt: z.string().optional(),
  rightImage: z.string().optional(),
  rightImageAlt: z.string().optional(),
  html: z.string().min(1, "Two-column text content is required"),
};

const imageGridBlockFields = {
  images: z.array(z.string().min(1)).min(1, "At least one image is required"),
};

const itineraryWithMapBlockFields = {
  itineraryId: z.string().uuid("Must be a valid itinerary UUID"),
};

// Shape-only schemas (for type inference — no `type` discriminator)
const textBlockDataShape = z.object(textBlockFields);
const twoColumnBlockDataShape = z.object(twoColumnBlockFields);
const imageGridBlockDataShape = z.object(imageGridBlockFields);
const itineraryWithMapBlockDataShape = z.object(itineraryWithMapBlockFields);

// ---------------------------------------------------------------------------
// Discriminated union (includes `type` for server action validation)
//
// The `two_column` cross-field rules (at least one side image, at least one
// side text, image field required when side is image) are enforced via
// superRefine on the union rather than refine on the branch — Zod 4's
// discriminatedUnion requires plain object schemas for discrimination.
// ---------------------------------------------------------------------------

export const blogBlockDataSchema = z
  .discriminatedUnion("type", [
    z.object({ type: z.literal("text"), ...textBlockFields }),
    z.object({ type: z.literal("two_column"), ...twoColumnBlockFields }),
    z.object({ type: z.literal("image_grid"), ...imageGridBlockFields }),
    z.object({
      type: z.literal("itinerary_with_map"),
      ...itineraryWithMapBlockFields,
    }),
  ])
  .superRefine((data, ctx) => {
    if (data.type !== "two_column") return;

    if (data.leftType !== "image" && data.rightType !== "image") {
      ctx.addIssue({
        code: "custom",
        message: "At least one side must be an image",
      });
    }
    if (data.leftType !== "text" && data.rightType !== "text") {
      ctx.addIssue({
        code: "custom",
        message: "At least one side must be text",
      });
    }
    if (
      data.leftType === "image" &&
      (!data.leftImage || data.leftImage.length === 0)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Left image is required when left side is image",
      });
    }
    if (
      data.rightType === "image" &&
      (!data.rightImage || data.rightImage.length === 0)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Right image is required when right side is image",
      });
    }
  });

// ---------------------------------------------------------------------------
// Blog post schemas
// ---------------------------------------------------------------------------

export const createBlogPostSchema = z.object({
  country: z.string().min(1, "Country is required"),
  countryCode: z
    .string()
    .min(2)
    .max(3, "Country code must be 2-3 characters"),
  state: z.string().nullable().optional(),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().nullable().optional(),
  header: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  excerpt: z.string().nullable().optional(),
  backgroundImage: z.string().nullable().optional(),
  tipsCtaCopy: z.string().nullable().optional(),
  tipsSlug: z.string().nullable().optional(),
  status: publishStatusSchema.optional().default("draft"),
});

export const updateBlogPostSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").optional(),
  subtitle: z.string().nullable().optional(),
  header: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  excerpt: z.string().nullable().optional(),
  backgroundImage: z.string().nullable().optional(),
  tipsCtaCopy: z.string().nullable().optional(),
  tipsSlug: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
});

// ---------------------------------------------------------------------------
// Itinerary schemas
// ---------------------------------------------------------------------------

export const createBlogItinerarySchema = z.object({
  title: z.string().min(1, "Itinerary title is required"),
  mapEmbedUrl: z.string().url().nullable().optional(),
});

export const updateBlogItinerarySchema = z.object({
  title: z.string().min(1, "Itinerary title cannot be empty").optional(),
  mapEmbedUrl: z.string().url().nullable().optional(),
});

export const createBlogItineraryItemSchema = z.object({
  content: z.string().min(1, "Itinerary item content is required"),
});

export const updateBlogItineraryItemSchema = z.object({
  content: z.string().min(1).optional(),
});

// ---------------------------------------------------------------------------
// Slugify helper — used by blog create server action to derive countrySlug
// ---------------------------------------------------------------------------

export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ---------------------------------------------------------------------------
// Exported types
// ---------------------------------------------------------------------------

// Renderer types (no `type` field — match existing interface contract)
export type TextBlockData = z.infer<typeof textBlockDataShape>;
export type TwoColumnBlockData = z.infer<typeof twoColumnBlockDataShape>;
export type ImageGridBlockData = z.infer<typeof imageGridBlockDataShape>;
export type ItineraryWithMapBlockData = z.infer<
  typeof itineraryWithMapBlockDataShape
>;

// Server action input types
export type BlogBlockInput = z.infer<typeof blogBlockDataSchema>;
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type CreateBlogItineraryInput = z.infer<
  typeof createBlogItinerarySchema
>;
export type UpdateBlogItineraryInput = z.infer<
  typeof updateBlogItinerarySchema
>;
export type CreateBlogItineraryItemInput = z.infer<
  typeof createBlogItineraryItemSchema
>;
export type UpdateBlogItineraryItemInput = z.infer<
  typeof updateBlogItineraryItemSchema
>;
