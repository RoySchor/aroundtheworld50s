import type {
  BlogPost,
  BlogBlock,
  BlogItinerary,
  BlogItineraryItem,
} from "@/server/db/schema";

// ---------------------------------------------------------------------------
// Block data shapes — must match the JSONB contract in schema.ts
// ---------------------------------------------------------------------------

export interface TextBlockData {
  html: string;
}

export interface TwoColumnBlockData {
  leftType: "image" | "text";
  rightType: "image" | "text";
  leftImage?: string;
  leftImageAlt?: string;
  rightImage?: string;
  rightImageAlt?: string;
  html: string;
}

export interface ImageGridBlockData {
  images: string[];
}

export interface ItineraryWithMapBlockData {
  itineraryId: string;
}

// ---------------------------------------------------------------------------
// Full post with nested relations (return type of getPostBySlugAndIndex)
// ---------------------------------------------------------------------------

export type FullBlogPost = BlogPost & {
  blocks: BlogBlock[];
  itineraries: (BlogItinerary & { items: BlogItineraryItem[] })[];
};
