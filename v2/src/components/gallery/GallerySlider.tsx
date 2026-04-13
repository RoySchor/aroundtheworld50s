"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface GalleryImage {
  cloudinaryPublicId: string;
  caption: string | null;
}

interface GallerySliderProps {
  images: GalleryImage[];
}

const IMAGES_PER_SLIDE = 3;
const AUTO_ADVANCE_MS = 5000;

export function GallerySlider({ images }: GallerySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = images.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) =>
      prev + IMAGES_PER_SLIDE >= totalImages ? 0 : prev + IMAGES_PER_SLIDE,
    );
  }, [totalImages]);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - IMAGES_PER_SLIDE < 0
        ? Math.max(0, totalImages - IMAGES_PER_SLIDE)
        : prev - IMAGES_PER_SLIDE,
    );
  };

  useEffect(() => {
    if (totalImages === 0) return;
    const interval = setInterval(nextSlide, AUTO_ADVANCE_MS);
    return () => clearInterval(interval);
  }, [totalImages, nextSlide]);

  if (totalImages === 0) return null;

  const currentImages = images.slice(
    currentIndex,
    currentIndex + IMAGES_PER_SLIDE,
  );

  return (
    <div className="gallery-container">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="gallery-title">
          Discover. Wonder. Experience. Live.
        </h2>
      </div>
      <div className="gallery-slider-container">
        <div className="gallery-image-row">
          {currentImages.map((image, index) => (
            <div key={currentIndex + index} className="gallery-image-box">
              <Image
                src={image.cloudinaryPublicId}
                alt={image.caption ?? `Gallery ${currentIndex + index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
        <button
          onClick={prevSlide}
          className="gallery-nav-button left-4"
          aria-label="Previous images"
        >
          &#10094;
        </button>
        <button
          onClick={nextSlide}
          className="gallery-nav-button right-4"
          aria-label="Next images"
        >
          &#10095;
        </button>
        <div className="gallery-counter">
          {currentIndex + 1} -{" "}
          {Math.min(currentIndex + IMAGES_PER_SLIDE, totalImages)} /{" "}
          {totalImages}
        </div>
      </div>
    </div>
  );
}
