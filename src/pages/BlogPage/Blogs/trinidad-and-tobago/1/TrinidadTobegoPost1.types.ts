export type LayoutType =
  | { type: "text" }
  | { type: "itinerary-with-map"; mapIndex: number }
  | { type: "image-grid"; images?: string[] }
  | {
      type: "two-column";
      leftType: "image" | "text";
      rightType: "image" | "text";
      leftImage?: string;
      rightImage?: string
    };

export type Itinerary = {
  title: string;
  items: string[];
};

export type ContentSection = {
  key: string;
  layout: LayoutType;
  content: string | null;
  images?: string[];
  leftImage?: string;
  rightImage?: string;
};

export type BlogPostContent = {
  header: string;
  title: string;
  subtitle: string;
  description: string;
  tipsSection?: string;
  itineraries: Itinerary[];
  content: ContentSection[];
};