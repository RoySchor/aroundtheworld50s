import React, { useState, useEffect } from "react";
import "../../../../styles/layout.css";
import "./RotatingGallery.css";
import { fetchGalleryImages } from "../../../../data/galleryImages";

const RotatingGallery = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const imagesPerSlide = 3;

  // Fetch images from Cloudinary on mount
  useEffect(() => {
    fetchGalleryImages().then((fetchedImages) => {
      setImages(fetchedImages);
      setLoading(false);
    });
  }, []);

  const totalImages = images.length;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + imagesPerSlide >= totalImages
        ? 0
        : prevIndex + imagesPerSlide,
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - imagesPerSlide < 0
        ? Math.max(0, totalImages - imagesPerSlide)
        : prevIndex - imagesPerSlide,
    );
  };

  // Auto-advance slides
  useEffect(() => {
    if (totalImages === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalImages]);

  const currentImages = images.slice(
    currentIndex,
    currentIndex + imagesPerSlide,
  );

  if (loading) {
    return (
      <div className="gallery-container">
        <div className="sliding-gallery-text-container">
          <h2 className="sliding-gallery-title">
            Discover. Wonder. Experience. Live.
          </h2>
        </div>
        <div className="rotating-gallery-container">
          <div className="rotating-gallery-image-container">
            <div className="rotating-gallery-loading">Loading gallery...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <div className="sliding-gallery-text-container">
        <h2 className="sliding-gallery-title">
          Discover. Wonder. Experience. Live.
        </h2>
      </div>
      <div className="rotating-gallery-container">
        <div className="rotating-gallery-image-container">
          {currentImages.map((image, index) => (
            <div key={index} className="rotating-gallery-image-box">
              <img
                src={image}
                alt={`Gallery ${currentIndex + index + 1}`}
                className="rotating-gallery-image"
              />
            </div>
          ))}
        </div>
        <button onClick={prevSlide} className="rotating-gallery-nav-button">
          ❮
        </button>
        <button onClick={nextSlide} className="rotating-gallery-nav-button">
          ❯
        </button>
        <div className="rotating-gallery-image-counter">
          {currentIndex + 1} -{" "}
          {Math.min(currentIndex + imagesPerSlide, totalImages)} / {totalImages}
        </div>
      </div>
    </div>
  );
};

export default RotatingGallery;
