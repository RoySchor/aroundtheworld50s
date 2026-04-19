import type { BlogBlock, BlogItinerary, BlogItineraryItem } from "@/server/db/schema";
import type {
  TextBlockData,
  TwoColumnBlockData,
  ImageGridBlockData,
  ImageCarouselBlockData,
  ItineraryWithMapBlockData,
} from "@/types/blog";
import { TextBlock } from "./blocks/TextBlock";
import { TwoColumnBlock } from "./blocks/TwoColumnBlock";
import { ImageGridBlock } from "./blocks/ImageGridBlock";
import { ImageCarouselBlock } from "./blocks/ImageCarouselBlock";
import { ItineraryWithMapBlock } from "./blocks/ItineraryWithMapBlock";

interface BlockRendererProps {
  block: BlogBlock;
  itineraries: (BlogItinerary & { items: BlogItineraryItem[] })[];
}

export function BlockRenderer({ block, itineraries }: BlockRendererProps) {
  switch (block.type) {
    case "text":
      return <TextBlock data={block.data as TextBlockData} />;
    case "two_column":
      return <TwoColumnBlock data={block.data as TwoColumnBlockData} />;
    case "image_grid":
      return <ImageGridBlock data={block.data as ImageGridBlockData} />;
    case "image_carousel":
      return <ImageCarouselBlock data={block.data as ImageCarouselBlockData} />;
    case "itinerary_with_map":
      return (
        <ItineraryWithMapBlock
          data={block.data as ItineraryWithMapBlockData}
          itineraries={itineraries}
        />
      );
    default:
      return null;
  }
}
