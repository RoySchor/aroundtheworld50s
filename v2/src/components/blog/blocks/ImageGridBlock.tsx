import Image from "next/image";
import { cloudinaryLoader } from "@/lib/cloudinary";
import type { ImageGridBlockData } from "@/types/blog";

interface ImageGridBlockProps {
  data: ImageGridBlockData;
}

export function ImageGridBlock({ data }: ImageGridBlockProps) {
  return (
    <div className="image-grid">
      {data.images.map((publicId, index) => (
        <div key={`${publicId}-${index}`} className="image-grid-item">
          <Image
            loader={cloudinaryLoader}
            src={publicId}
            alt={`Gallery ${index + 1}`}
            fill
            className="image-grid-image"
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
}
