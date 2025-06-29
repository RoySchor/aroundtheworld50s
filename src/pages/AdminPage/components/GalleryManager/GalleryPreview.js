import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const GalleryPreview = ({ currentImages, newImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const allImages = [...currentImages, ...newImages];
  const imagesPerSlide = 3;
  const totalImages = allImages.length;

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

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoPlaying, totalImages]);

  const currentImages_displayed = allImages.slice(
    currentIndex,
    currentIndex + imagesPerSlide,
  );

  if (totalImages === 0) {
    return (
      <div className="gallery-preview-container">
        <div className="gallery-preview-info">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            📭 Gallery Preview - No Images
          </h3>
          <p className="text-blue-700">
            Add some images in the Manage tab to see the gallery preview.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-preview-container">
      <div className="gallery-preview-info">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          👁️ Gallery Preview
        </h3>
        <p className="text-blue-700">
          This is how the rotating gallery will look on your home page with{" "}
          {totalImages} total images. The gallery shows{" "}
          {Math.min(imagesPerSlide, totalImages)} images at a time and rotates
          every 5 seconds.
        </p>
      </div>

      {/* Gallery Simulator */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
          <h4 className="text-center text-xl font-bold text-gray-800 mb-6">
            Discover. Wonder. Experience. Live.
          </h4>

          <div className="relative bg-white rounded-lg shadow-lg p-4">
            <div className="flex gap-4 justify-center">
              {currentImages_displayed.map((image, index) => (
                <div key={`${image.id}-${index}`} className="flex-1 max-w-xs">
                  <img
                    src={image.src}
                    alt={image.name}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                </div>
              ))}
            </div>

            {totalImages > imagesPerSlide && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                  aria-label="Previous slide"
                >
                  ❮
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                  aria-label="Next slide"
                >
                  ❯
                </button>

                <div className="text-center mt-4 text-sm text-gray-600">
                  {currentIndex + 1} -{" "}
                  {Math.min(currentIndex + imagesPerSlide, totalImages)} /{" "}
                  {totalImages}
                </div>
              </>
            )}
          </div>

          <div className="flex justify-center mt-4 gap-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                isAutoPlaying
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {isAutoPlaying ? "⏸️ Pause Auto-Rotate" : "▶️ Start Auto-Rotate"}
            </button>
          </div>
        </div>
      </div>

      {/* All Images Grid */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          All Gallery Images ({totalImages} total)
        </h4>
        <div className="gallery-preview-grid">
          {allImages.map((image) => (
            <div key={image.id} className="gallery-preview-item">
              <img
                src={image.src}
                alt={image.name}
                className="gallery-preview-image"
              />
              <div className="gallery-preview-info-bar">
                <div className="gallery-preview-name">{image.name}</div>
                <div className="flex justify-between items-center mt-1">
                  <span
                    className={`gallery-preview-status ${
                      image.isNew ? "new" : "existing"
                    }`}
                  >
                    {image.isNew ? "NEW" : "EXISTING"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">
          📊 Gallery Statistics
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {totalImages}
            </div>
            <div className="text-gray-600">Total Images</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {newImages.length}
            </div>
            <div className="text-gray-600">New Images</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {currentImages.length}
            </div>
            <div className="text-gray-600">Existing Images</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.ceil(totalImages / imagesPerSlide)}
            </div>
            <div className="text-gray-600">Gallery Slides</div>
          </div>
        </div>
      </div>
    </div>
  );
};

GalleryPreview.propTypes = {
  currentImages: PropTypes.array.isRequired,
  newImages: PropTypes.array.isRequired,
};

export default GalleryPreview;
