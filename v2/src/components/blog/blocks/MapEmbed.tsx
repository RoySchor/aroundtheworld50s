interface MapEmbedProps {
  title: string;
  url: string;
}

export function MapEmbed({ title, url }: MapEmbedProps) {
  return (
    <div className="map-embed">
      <h3 className="map-title">{title}</h3>
      <div className="map-container">
        <iframe
          title={`${title} - Interactive Map`}
          src={url}
          width="100%"
          className="h-[250px] sm:h-[350px] md:h-[450px]"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
