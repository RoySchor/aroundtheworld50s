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
        placeholder="Enter your text content here. You can include links using markdown syntax: [link text](https://example.com) - they will be automatically converted to proper HTML links!"
        rows={8}
      />

      <div className="blog-form-section-info">
        <small className="blog-form-help-text">
          💡 <strong>Tip:</strong> You can include links using markdown syntax:
          <code>[link text](https://example.com)</code> - they will be
          automatically converted to properly formatted HTML links with the
          correct styling!
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
