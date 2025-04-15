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
}

interface TwoColumnLayout extends BaseLayout {
  type: "two-column";
  leftType: "image" | "text";
  rightType: "image" | "text";
  leftImage?: string;
  rightImage?: string;
  imageAlt?: string;
}

export type LayoutType =
  | TextLayout
  | ItineraryWithMapLayout
  | ImageGridLayout
  | TwoColumnLayout;

export interface Itinerary {
  title: string;
  items: string[];
}

export interface ContentSection {
  key: string;
  layout: LayoutType;
  content: string | null;
  images?: string[];
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
  backgroundImage?: string;
  itineraries: Itinerary[];
  content: ContentSection[];
}