import React from "react";
import PropTypes from "prop-types";
import FormField from "../../FormField/FormField";

const TwoColumnContentSection = ({
  section,
  sectionIndex,
  onContentChange,
  generateKey,
}) => {
  const handleLayoutChange = (field, value) => {
    onContentChange(sectionIndex, `layout.${field}`, value);
  };

  const generateAltText = (filename) => {
    if (!filename) return "";

    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");

    // Convert to lowercase, replace spaces with dashes, remove special characters
    return nameWithoutExt
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleImageChange = (file) => {
    onContentChange(sectionIndex, "image", file);

    if (file && file.name) {
      const altText = generateAltText(file.name);
      handleLayoutChange("image_alt", altText);
    }
  };

  return (
    <div className="blog-form-two-column-section">
      <div className="blog-form-layout-selection">
        <label className="blog-form-label">Column Layout</label>
        <div className="blog-form-radio-group">
          <label className="blog-form-radio-label">
            <input
              type="radio"
              name={`layout_${sectionIndex}`}
              value="image-left"
              checked={
                section.layout.left_type === "image" &&
                section.layout.right_type === "text"
              }
              onChange={() => {
                handleLayoutChange("left_type", "image");
                handleLayoutChange("right_type", "text");
              }}
              className="blog-form-radio"
            />
            <span className="blog-form-radio-text">
              📷 Image Left, Text Right
            </span>
          </label>
          <label className="blog-form-radio-label">
            <input
              type="radio"
              name={`layout_${sectionIndex}`}
              value="image-right"
              checked={
                section.layout.left_type === "text" &&
                section.layout.right_type === "image"
              }
              onChange={() => {
                handleLayoutChange("left_type", "text");
                handleLayoutChange("right_type", "image");
              }}
              className="blog-form-radio"
            />
            <span className="blog-form-radio-text">
              📝 Text Left, Image Right
            </span>
          </label>
        </div>
      </div>

      {/* Text Content */}
      <FormField
        id={`two_column_text_${sectionIndex}`}
        label="Text Content"
        type="textarea"
        value={section.content || ""}
        onChange={(value) => onContentChange(sectionIndex, "content", value)}
        placeholder="Enter your text content here. You can include links using markdown syntax: [link text](https://example.com) - they will be automatically converted to proper HTML links!"
        rows={6}
      />

      {/* Image Upload */}
      <FormField
        id={`two_column_image_${sectionIndex}`}
        label="Image"
        type="file"
        value={section.image || null}
        onChange={handleImageChange}
        accept=".jpg,.jpeg,.JPG,.JPEG,.png,.PNG,.webp,.WEBP,.gif,.GIF"
      />

      <div className="blog-form-section-info">
        <small className="blog-form-help-text">
          💡 <strong>Layout Preview:</strong>{" "}
          {section.layout.left_type === "image"
            ? "Image will appear on the left, text on the right"
            : "Text will appear on the left, image on the right"}
        </small>
      </div>
    </div>
  );
};

TwoColumnContentSection.propTypes = {
  section: PropTypes.shape({
    key: PropTypes.string.isRequired,
    layout: PropTypes.shape({
      type: PropTypes.string.isRequired,
      left_type: PropTypes.string,
      right_type: PropTypes.string,
      image_alt: PropTypes.string,
    }).isRequired,
    content: PropTypes.string,
    image: PropTypes.object,
  }).isRequired,
  sectionIndex: PropTypes.number.isRequired,
  onContentChange: PropTypes.func.isRequired,
  generateKey: PropTypes.func.isRequired,
};

export default TwoColumnContentSection;
