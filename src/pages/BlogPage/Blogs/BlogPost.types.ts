interface BaseLayout {
  type: string;
}

interface TextLayout extends BaseLayout {
  type: "text";
}

interface ItineraryWithMapLayout extends BaseLayout {
  type: "itinerary-with-map";
  mapIndex: number;
}

interface ImageGridLayout extends BaseLayout {
  type: "image-grid";
  images?: string[];
  imageCaptions?: string[];
}

interface TwoColumnLayout extends BaseLayout {
  type: "two-column";
  leftType: "image" | "text";
  rightType: "image" | "text";
  leftImage?: string;
  rightImage?: string;
  imageAlt?: string;
  imageCaption?: string;
}

export type LayoutType = {
  type: "text" | "two-column" | "image-grid" | "itinerary-with-map" | "instagram";
  leftType?: "text" | "image";
  rightType?: "text" | "image";
  imageAlt?: string;
  imageCaption?: string;
  mapIndex?: number;
};

export interface Itinerary {
  title: string;
  items: string[];
}

export interface ContentSection {
  key: string;
  layout: LayoutType;
  content: string | null;
  images?: string[];
  imageCaptions?: string[];
  leftImage?: string;
  rightImage?: string;
}

export interface BlogPostContent {
  country: string;
  path: string;
  header: string;
  title: string;
  subtitle: string;
  description: string;
  tipsSection?: string;
  tipsLink?: string;
  backgroundImage?: string;
  itineraries: Itinerary[];
  content: ContentSection[];
}