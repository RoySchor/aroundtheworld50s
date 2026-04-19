"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import type { ImageCarouselBlockData } from "@/types/blog";

const AUTO_ADVANCE_MS = 5000;
const SWIPE_THRESHOLD = 50;

interface ImageCarouselBlockProps {
  data: ImageCarouselBlockData;
}

export function ImageCarouselBlock({ data }: ImageCarouselBlockProps) {
  const { images } = data;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (paused || images.length < 2) return;
    const interval = setInterval(nextSlide, AUTO_ADVANCE_MS);
    return () => clearInterval(interval);
  }, [paused, images.length, nextSlide]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta < 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
    setPaused(false);
  }

  const current = images[currentIndex];

  return (
    <div
      className="image-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="image-carousel-viewport"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={current.publicId}
          alt={current.caption || `Image ${currentIndex + 1}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 900px"
        />
        <button
          type="button"
          onClick={prevSlide}
          className="image-carousel-nav left-3"
          aria-label="Previous image"
        >
          &#10094;
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="image-carousel-nav right-3"
          aria-label="Next image"
        >
          &#10095;
        </button>
      </div>
      <p className="image-carousel-counter">
        {currentIndex + 1} / {images.length}
      </p>
      {current.caption && (
        <p className="image-carousel-caption">{current.caption}</p>
      )}
    </div>
  );
}
