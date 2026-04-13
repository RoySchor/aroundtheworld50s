import Image from "next/image";
import { cloudinaryLoader } from "@/lib/cloudinary";
import { sanitizeHtml } from "@/lib/sanitize";
import type { TwoColumnBlockData } from "@/types/blog";

interface TwoColumnBlockProps {
  data: TwoColumnBlockData;
}

function Pane({
  type,
  image,
  imageAlt,
  html,
}: {
  type: "image" | "text";
  image?: string;
  imageAlt?: string;
  html: string;
}) {
  if (type === "image" && image) {
    return (
      <div className="content-pane-image">
        <div className="image-container">
          <Image
            loader={cloudinaryLoader}
            src={image}
            alt={imageAlt || "Blog image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    );
  }

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
          image={data.leftImage}
          imageAlt={data.leftImageAlt}
          html={data.html}
        />
      </div>
      <div className="two-col-column">
        <Pane
          type={data.rightType}
          image={data.rightImage}
          imageAlt={data.rightImageAlt}
          html={data.html}
        />
      </div>
    </div>
  );
}
