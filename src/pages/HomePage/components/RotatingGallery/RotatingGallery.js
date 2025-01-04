import React, { useState, useEffect } from "react";
import "../../../../styles/layout.css";
import "./RotatingGallery.css";

const RotatingGallery = () => {
  const importAll = (r) => r.keys().map(r);

  const images = importAll(
    require.context(
      "../../../../assets/homePageGallery",
      false,
      /\.(png|jpe?g|svg)$/,
    ),
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const imagesPerSlide = 3;
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
        ? totalImages - imagesPerSlide
        : prevIndex - imagesPerSlide,
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentImages = images.slice(
    currentIndex,
    currentIndex + imagesPerSlide,
  );

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
                src={image.default || image}
                alt={`Gallery ${currentIndex + index + 1}`}
                className="rotating-gallery-image"
              />
            </div>
          ))}
        </div>
        <button onClick={prevSlide} className="rotating-gallery-nav-button ">
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
