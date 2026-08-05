import { sanitizeHtml } from "@/lib/sanitize";
import type { ItineraryWithMapBlockData } from "@/types/blog";
import type { BlogItinerary, BlogItineraryItem } from "@/server/db/schema";
import { MapEmbed } from "./MapEmbed";

interface ItineraryWithMapBlockProps {
  data: ItineraryWithMapBlockData;
  itineraries: (BlogItinerary & { items: BlogItineraryItem[] })[];
}

export function ItineraryWithMapBlock({ data, itineraries }: ItineraryWithMapBlockProps) {
  const itinerary = itineraries.find((it) => it.id === data.itineraryId);
  if (!itinerary) return null;

  return (
    <div className="two-column-layout">
      <div className="two-col-column">
        <div className="content-pane-list">
          <div className="post-itinerary-section">
            <div className="post-itinerary-title">{itinerary.title}</div>
            <ul>
              {itinerary.items.map((item) => (
                <li
                  key={item.id}
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(item.content),
                  }}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="two-col-column">
        <div className="content-pane-map">
          {itinerary.mapEmbedUrl && (
            <MapEmbed title={itinerary.title} url={itinerary.mapEmbedUrl} />
          )}
        </div>
      </div>
    </div>
  );
}
