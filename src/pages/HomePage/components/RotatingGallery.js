import React, { useState, useEffect } from "react";
import "../../../styles/layout.css";

const RotatingGallery = () => {
  const importAll = (r) => r.keys().map(r);
  const images = importAll(
    require.context(
      "../../../assets/homePageGallery",
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
    <div className="relative bg-white py-10">
      <div className="max-w-5xl mx-auto px-4 relative">
        <div className="flex gap-4 justify-center">
          {currentImages.map((image, index) => (
            <div
              key={index}
              className="relative w-1/3 h-64 bg-gray-200 rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={image.default || image}
                alt={`Gallery ${currentIndex + index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute top-1/3 left-4 transform translate-y-1/2 bg-gray-800 text-white w-10 h-10 rounded-md hover:bg-gray-700 focus:outline-none"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/3 right-4 transform translate-y-1/2 bg-gray-800 text-white w-10 h-10 rounded-md hover:bg-gray-700 focus:outline-none"
        >
          ❯
        </button>

        <div className="text-center mt-4 text-lg text-gray-600">
          {currentIndex + 1} -{" "}
          {Math.min(currentIndex + imagesPerSlide, totalImages)} / {totalImages}
        </div>
      </div>
    </div>
  );
};

export default RotatingGallery;
