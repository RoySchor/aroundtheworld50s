import Image from "next/image";
import { sanitizeHtml } from "@/lib/sanitize";
import type { TwoColumnBlockData } from "@/types/blog";

interface TwoColumnBlockProps {
  data: TwoColumnBlockData;
}

function Pane({
  type,
  images,
  html,
}: {
  type: "image" | "text";
  images?: Array<{ publicId: string; alt?: string }>;
  html?: string;
}) {
  if (type === "image" && images?.length) {
    if (images.length === 1) {
      return (
        <div className="content-pane-image">
          <div className="single-image-container">
            <Image
              src={images[0].publicId}
              alt={images[0].alt || "Blog image"}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="content-pane-image">
        <div className="stacked-images">
          {images.map((img, i) => (
            <div key={img.publicId} className="stacked-image-item">
              <Image
                src={img.publicId}
                alt={img.alt || `Image ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!html) return null;

  return (
    <div className="content-pane-text">
      <div
        className="post-description"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
      />
    </div>
  );
}

export function TwoColumnBlock({ data }: TwoColumnBlockProps) {
  return (
    <div className="two-column-layout">
      <div className="two-col-column">
        <Pane
          type={data.leftType}
          images={data.leftImages}
          html={data.html}
        />
      </div>
      <div className="two-col-column">
        <Pane
          type={data.rightType}
          images={data.rightImages}
          html={data.html}
        />
      </div>
    </div>
  );
}
