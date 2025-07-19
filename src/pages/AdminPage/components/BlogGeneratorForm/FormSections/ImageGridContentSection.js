import React from "react";
import PropTypes from "prop-types";
import FormField from "../../FormField/FormField";

const ImageGridContentSection = ({
  section,
  sectionIndex,
  onContentChange,
  generateKey,
}) => {
  const handleImageAdd = () => {
    const currentImages = section.images || [];
    onContentChange(sectionIndex, "images", [...currentImages, null]);
  };

  const handleImageRemove = (imageIndex) => {
    const currentImages = section.images || [];
    if (currentImages.length > 1) {
      const updatedImages = currentImages.filter((_, i) => i !== imageIndex);
      onContentChange(sectionIndex, "images", updatedImages);
    }
  };

  const handleImageChange = (imageIndex, file) => {
    const currentImages = section.images || [];
    const updatedImages = [...currentImages];
    updatedImages[imageIndex] = file;
    onContentChange(sectionIndex, "images", updatedImages);
  };

  return (
    <div className="blog-form-image-grid-section">
      <div className="blog-form-images-section">
        <div className="blog-form-images-header">
          <label className="blog-form-label">Grid Images</label>
        </div>

        {(section.images || [null]).map((image, imageIndex) => (
          <div key={imageIndex} className="blog-form-image-row">
            <FormField
              id={`image_grid_${sectionIndex}_image_${imageIndex}`}
              label={`Image ${imageIndex + 1}`}
              type="file"
              value={image}
              onChange={(file) => handleImageChange(imageIndex, file)}
              accept=".jpg,.jpeg,.JPG,.JPEG,.png,.PNG,.webp,.WEBP,.gif,.GIF"
            />
            {(section.images || []).length > 1 && (
              <button
                type="button"
                onClick={() => handleImageRemove(imageIndex)}
                className="blog-form-remove-item-btn"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="blog-form-section-info">
        <small className="blog-form-help-text">
          💡 <strong>Tip:</strong> Upload multiple images to create a beautiful
          grid layout. Images will be displayed in the order you upload them.
        </small>
      </div>

      <button
        type="button"
        onClick={handleImageAdd}
        className="blog-form-floating-add-btn"
      >
        + Add Image
      </button>
    </div>
  );
};

ImageGridContentSection.propTypes = {
  section: PropTypes.shape({
    key: PropTypes.string.isRequired,
    layout: PropTypes.shape({
      type: PropTypes.string.isRequired,
    }).isRequired,
    content: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  sectionIndex: PropTypes.number.isRequired,
  onContentChange: PropTypes.func.isRequired,
  generateKey: PropTypes.func.isRequired,
};

export default ImageGridContentSection;
