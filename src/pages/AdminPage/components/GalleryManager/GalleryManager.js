import React, { useState, useEffect } from "react";
import GalleryForm from "./GalleryForm";
import GalleryPreview from "./GalleryPreview";
import GalleryScriptRunner from "./GalleryScriptRunner";
import "./GalleryManager.css";
import { fetchGalleryImages } from "../../../../data/galleryImages";

const GalleryManager = () => {
  const [activeTab, setActiveTab] = useState("manage"); // "manage", "preview", or "deploy"
  const [currentImages, setCurrentImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCurrentImages();
  }, []);

  const loadCurrentImages = async () => {
    try {
      setIsLoading(true);
      // Fetch images from Cloudinary
      const cloudinaryImages = await fetchGalleryImages();

      const imageData = cloudinaryImages.map((url, index) => {
        // Extract filename from Cloudinary URL
        const urlParts = url.split('/');
        const filename = urlParts[urlParts.length - 1];

        return {
          id: index,
          name: filename,
          src: url,
          isNew: false,
        };
      });

      setCurrentImages(imageData);
    } catch (error) {
      console.error("Error loading current images:", error);
      setCurrentImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImages = (files) => {
    const newImageObjects = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      file: file,
      src: URL.createObjectURL(file),
      isNew: true,
    }));

    setNewImages((prev) => [...prev, ...newImageObjects]);
  };

  const handleRemoveCurrentImage = (imageId) => {
    const imageToRemove = currentImages.find((img) => img.id === imageId);
    if (imageToRemove) {
      setRemovedImages((prev) => [...prev, imageToRemove]);
      setCurrentImages((prev) => prev.filter((img) => img.id !== imageId));
    }
  };

  const handleRemoveNewImage = (imageId) => {
    const imageToRemove = newImages.find((img) => img.id === imageId);
    if (imageToRemove && imageToRemove.src.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.src);
    }
    setNewImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleRestoreImage = (imageId) => {
    const imageToRestore = removedImages.find((img) => img.id === imageId);
    if (imageToRestore) {
      setCurrentImages((prev) => [...prev, imageToRestore]);
      setRemovedImages((prev) => prev.filter((img) => img.id !== imageId));
    }
  };

  const hasChanges = () => {
    return newImages.length > 0 || removedImages.length > 0;
  };

  const resetChanges = () => {
    newImages.forEach((img) => {
      if (img.src.startsWith("blob:")) {
        URL.revokeObjectURL(img.src);
      }
    });

    // Restore removed images
    setCurrentImages((prev) => [...prev, ...removedImages]);
    setNewImages([]);
    setRemovedImages([]);
  };

  if (isLoading) {
    return (
      <div className="gallery-manager-loading">
        <div className="gallery-manager-loading-spinner"></div>
        <p>Loading gallery images...</p>
      </div>
    );
  }

  return (
    <div className="gallery-manager-container">
      <div className="gallery-manager-header">
        <h2 className="gallery-manager-title">Home Page Gallery Manager</h2>
        <p className="gallery-manager-subtitle">
          Manage images in the rotating gallery on the home page
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="gallery-tab-navigation">
        <button
          className={`gallery-tab ${activeTab === "manage" ? "active" : ""}`}
          onClick={() => setActiveTab("manage")}
        >
          🛠️ Manage
        </button>
        <button
          className={`gallery-tab ${activeTab === "preview" ? "active" : ""}`}
          onClick={() => setActiveTab("preview")}
        >
          👁️ Preview
        </button>
        <button
          className={`gallery-tab ${activeTab === "deploy" ? "active" : ""}`}
          onClick={() => setActiveTab("deploy")}
          disabled={!hasChanges()}
        >
          🚀 Deploy
        </button>
      </div>

      {/* Tab Content */}
      <div className="gallery-tab-content">
        {activeTab === "manage" && (
          <GalleryForm
            currentImages={currentImages}
            newImages={newImages}
            removedImages={removedImages}
            onAddImages={handleAddImages}
            onRemoveCurrentImage={handleRemoveCurrentImage}
            onRemoveNewImage={handleRemoveNewImage}
            onRestoreImage={handleRestoreImage}
            onResetChanges={resetChanges}
            hasChanges={hasChanges()}
          />
        )}

        {activeTab === "preview" && (
          <GalleryPreview currentImages={currentImages} newImages={newImages} />
        )}

        {activeTab === "deploy" && (
          <GalleryScriptRunner
            newImages={newImages}
            removedImages={removedImages}
            onComplete={() => {
              resetChanges();
              loadCurrentImages();
              setActiveTab("manage");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GalleryManager;
