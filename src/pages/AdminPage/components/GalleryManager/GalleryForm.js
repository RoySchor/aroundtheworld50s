import React, { useRef } from "react";
import PropTypes from "prop-types";

const GalleryForm = ({
  currentImages,
  newImages,
  removedImages,
  onAddImages,
  onRemoveCurrentImage,
  onRemoveNewImage,
  onRestoreImage,
  onResetChanges,
  hasChanges,
}) => {
  const fileInputRef = useRef(null);

  const handleFileInputChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onAddImages(files);
      // Reset the input so the same files can be selected again
      event.target.value = "";
    }
  };

  const allImages = [...currentImages, ...newImages];

  return (
    <div className="gallery-form-container">
      {/* Changes Summary */}
      {hasChanges && (
        <div className="gallery-changes-summary">
          <h3 className="gallery-changes-title">📝 Pending Changes</h3>
          <div className="gallery-changes-list">
            {newImages.length > 0 && (
              <div>✅ {newImages.length} image(s) to add</div>
            )}
            {removedImages.length > 0 && (
              <div>❌ {removedImages.length} image(s) to remove</div>
            )}
          </div>
          <button onClick={onResetChanges} className="gallery-reset-btn">
            🔄 Reset All Changes
          </button>
        </div>
      )}

      {/* Current Gallery Section */}
      <div className="gallery-section">
        <h3 className="gallery-section-title">
          🖼️ Current Gallery Images
          <span className="text-sm font-normal text-gray-500">
            ({allImages.length} total)
          </span>
        </h3>
        <p className="gallery-section-subtitle">
          These images are currently displayed in the rotating gallery on your
          home page. Click the remove button on hover to mark images for
          removal.
        </p>

        {allImages.length > 0 ? (
          <div className="gallery-images-grid">
            {currentImages.map((image) => (
              <div key={image.id} className="gallery-image-item group">
                <img
                  src={image.src}
                  alt={image.name}
                  className="gallery-image"
                />
                <div className="gallery-image-overlay">
                  <button
                    onClick={() => onRemoveCurrentImage(image.id)}
                    className="gallery-remove-btn"
                    title="Remove this image"
                  >
                    🗑️ Remove
                  </button>
                </div>
                <div className="gallery-image-name">{image.name}</div>
              </div>
            ))}
            {newImages.map((image) => (
              <div key={image.id} className="gallery-image-item group">
                <img
                  src={image.src}
                  alt={image.name}
                  className="gallery-image"
                />
                <div className="gallery-image-overlay">
                  <button
                    onClick={() => onRemoveNewImage(image.id)}
                    className="gallery-remove-btn"
                    title="Remove this new image"
                  >
                    🗑️ Remove
                  </button>
                </div>
                <div className="gallery-image-name">
                  {image.name}
                  <span className="text-green-400 ml-1">✨ NEW</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No images in the gallery
          </div>
        )}
      </div>

      {/* Add New Images Section */}
      <div className="gallery-section">
        <h3 className="gallery-section-title">➕ Add New Images</h3>
        <p className="gallery-section-subtitle">
          Upload new images to add to the rotating gallery. Supported formats:
          JPG, JPEG, PNG, WebP, GIF
        </p>

        <div className="gallery-add-section">
          <div className="mb-4">
            <div className="text-4xl mb-2">📸</div>
            <p className="text-gray-600 mb-4">
              Click to select images from your computer
            </p>
            <label className="gallery-file-label">
              📁 Choose Images
              <input
                ref={fileInputRef}
                type="file"
                className="gallery-file-input"
                multiple
                accept=".jpg,.jpeg,.png,.webp,.gif"
                onChange={handleFileInputChange}
              />
            </label>
          </div>
          <div className="text-xs text-gray-500">
            Tip: You can select multiple images at once by holding Ctrl/Cmd
            while clicking
          </div>
        </div>
      </div>

      {/* Removed Images Section */}
      {removedImages.length > 0 && (
        <div className="gallery-section gallery-removed-section">
          <h3 className="gallery-section-title">
            🗑️ Images Marked for Removal
            <span className="text-sm font-normal text-gray-500">
              ({removedImages.length} images)
            </span>
          </h3>
          <p className="gallery-section-subtitle">
            These images will be removed from the gallery when you deploy. Click
            restore to bring them back.
          </p>

          <div className="gallery-images-grid">
            {removedImages.map((image) => (
              <div
                key={image.id}
                className="gallery-image-item group opacity-60"
              >
                <img
                  src={image.src}
                  alt={image.name}
                  className="gallery-image grayscale"
                />
                <div className="gallery-image-overlay">
                  <button
                    onClick={() => onRestoreImage(image.id)}
                    className="gallery-restore-btn"
                    title="Restore this image"
                  >
                    ↩️ Restore
                  </button>
                </div>
                <div className="gallery-image-name">
                  {image.name}
                  <span className="text-red-400 ml-1">❌ REMOVED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="gallery-section">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">💡 How it works:</h4>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>
              <strong>Manage Tab:</strong> Add or remove images from the gallery
            </li>
            <li>
              <strong>Preview Tab:</strong> See how the gallery will look with
              your changes
            </li>
            <li>
              <strong>Deploy Tab:</strong> Run the deployment script to apply
              changes
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

GalleryForm.propTypes = {
  currentImages: PropTypes.array.isRequired,
  newImages: PropTypes.array.isRequired,
  removedImages: PropTypes.array.isRequired,
  onAddImages: PropTypes.func.isRequired,
  onRemoveCurrentImage: PropTypes.func.isRequired,
  onRemoveNewImage: PropTypes.func.isRequired,
  onRestoreImage: PropTypes.func.isRequired,
  onResetChanges: PropTypes.func.isRequired,
  hasChanges: PropTypes.bool.isRequired,
};

export default GalleryForm;
