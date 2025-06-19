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
        placeholder="Enter your text content here. You can include HTML links like <a href='https://example.com' className='post-link' target='_blank' rel='noopener noreferrer'>link text</a>"
        rows={6}
      />

      {/* Image Upload */}
      <FormField
        id={`two_column_image_${sectionIndex}`}
        label="Image"
        type="file"
        value={section.image || null}
        onChange={(value) => onContentChange(sectionIndex, "image", value)}
        accept=".jpg,.jpeg,.png,.webp,.gif"
      />

      {/* Image Alt Text */}
      <FormField
        id={`two_column_image_alt_${sectionIndex}`}
        label="Image Alt Text"
        value={section.layout.image_alt || ""}
        onChange={(value) => handleLayoutChange("image_alt", value)}
        placeholder="Enter descriptive alt text for the image (for accessibility)"
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
