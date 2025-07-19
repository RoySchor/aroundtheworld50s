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
    const currentImages = section.layout.images || [];
    const currentCaptions = section.layout.imageCaptions || [];
    onContentChange(sectionIndex, "layout.images", [...currentImages, null]);
    onContentChange(sectionIndex, "layout.imageCaptions", [
      ...currentCaptions,
      "",
    ]);
  };

  const handleImageRemove = (imageIndex) => {
    const currentImages = section.layout.images || [];
    const currentCaptions = section.layout.imageCaptions || [];
    if (currentImages.length > 1) {
      const updatedImages = currentImages.filter((_, i) => i !== imageIndex);
      const updatedCaptions = currentCaptions.filter(
        (_, i) => i !== imageIndex,
      );
      onContentChange(sectionIndex, "layout.images", updatedImages);
      onContentChange(sectionIndex, "layout.imageCaptions", updatedCaptions);
    }
  };

  const handleImageChange = (imageIndex, file) => {
    const currentImages = section.layout.images || [];
    const updatedImages = [...currentImages];
    updatedImages[imageIndex] = file;
    onContentChange(sectionIndex, "layout.images", updatedImages);
  };

  const handleCaptionChange = (imageIndex, caption) => {
    const currentCaptions = section.layout.imageCaptions || [];
    const updatedCaptions = [...currentCaptions];
    updatedCaptions[imageIndex] = caption;
    onContentChange(sectionIndex, "layout.imageCaptions", updatedCaptions);
  };

  return (
    <div className="blog-form-image-grid-section">
      <div className="blog-form-images-section">
        <div className="blog-form-images-header">
          <label className="blog-form-label">Grid Images</label>
        </div>

        {(section.layout.images || [null]).map((image, imageIndex) => (
          <div key={imageIndex} className="blog-form-image-row">
            <div className="blog-form-image-input-group">
              <FormField
                id={`image_grid_${sectionIndex}_image_${imageIndex}`}
                label={`Image ${imageIndex + 1}`}
                type="file"
                value={image}
                onChange={(file) => handleImageChange(imageIndex, file)}
                accept=".jpg,.jpeg,.JPG,.JPEG,.png,.PNG,.webp,.WEBP,.gif,.GIF"
              />
              <FormField
                id={`image_grid_${sectionIndex}_caption_${imageIndex}`}
                label="Caption (optional)"
                type="text"
                value={(section.layout.imageCaptions || [])[imageIndex] || ""}
                onChange={(value) => handleCaptionChange(imageIndex, value)}
                placeholder="Add a caption for this image"
              />
            </div>
            {(section.layout.images || []).length > 1 && (
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
          Add optional captions to provide more context.
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
      images: PropTypes.arrayOf(PropTypes.object),
      imageCaptions: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    content: PropTypes.string,
  }).isRequired,
  sectionIndex: PropTypes.number.isRequired,
  onContentChange: PropTypes.func.isRequired,
  generateKey: PropTypes.func.isRequired,
};

export default ImageGridContentSection;
