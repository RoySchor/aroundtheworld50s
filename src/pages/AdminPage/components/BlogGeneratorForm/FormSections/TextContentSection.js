import React from "react";
import PropTypes from "prop-types";
import FormField from "../../FormField/FormField";

const TextContentSection = ({
  section,
  sectionIndex,
  onContentChange,
  generateKey,
}) => {
  return (
    <div className="blog-form-text-section">
      <FormField
        id={`text_content_${sectionIndex}`}
        label="Text Content"
        type="textarea"
        value={section.content || ""}
        onChange={(value) => onContentChange(sectionIndex, "content", value)}
        placeholder="Enter your text content here. You can include HTML links like <a href='https://example.com' className='post-link' target='_blank' rel='noopener noreferrer'>link text</a>"
        rows={8}
      />

      <div className="blog-form-section-info">
        <small className="blog-form-help-text">
          💡 <strong>Tip:</strong> You can include HTML links in your text using
          the format shown in the placeholder
        </small>
      </div>
    </div>
  );
};

TextContentSection.propTypes = {
  section: PropTypes.shape({
    key: PropTypes.string.isRequired,
    layout: PropTypes.shape({
      type: PropTypes.string.isRequired,
    }).isRequired,
    content: PropTypes.string,
  }).isRequired,
  sectionIndex: PropTypes.number.isRequired,
  onContentChange: PropTypes.func.isRequired,
  generateKey: PropTypes.func.isRequired,
};

export default TextContentSection;
