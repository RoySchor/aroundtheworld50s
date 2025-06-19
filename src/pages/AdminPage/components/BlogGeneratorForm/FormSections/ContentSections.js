import React from "react";
import PropTypes from "prop-types";
import TextContentSection from "./TextContentSection";
import TwoColumnContentSection from "./TwoColumnContentSection";
import ImageGridContentSection from "./ImageGridContentSection";
import ItineraryWithMapContentSection from "./ItineraryWithMapContentSection";

const ContentSections = ({
  formData,
  onInputChange,
  onContentChange,
  onAddContentSection,
  onRemoveContentSection,
}) => {
  const generateKey = (type, index) => {
    return `${type}Section${index + 1}`;
  };

  const getSectionTitle = (type) => {
    switch (type) {
      case "text":
        return "Text Section";
      case "two-column":
        return "Two-Column Section";
      case "image-grid":
        return "Image Grid Section";
      case "itinerary-with-map":
        return "Itinerary with Map Section";
      default:
        return "Content Section";
    }
  };

  // Check if itinerary-with-map sections can be added
  const canAddItineraryWithMap = () => {
    if (!formData.include_itineraries || !formData.include_maps) {
      return false;
    }

    const mapCount = formData.maps?.length || 0;

    const currentItineraryWithMapCount = formData.content_sections.filter(
      (section) => section.layout.type === "itinerary-with-map",
    ).length;

    return currentItineraryWithMapCount < mapCount;
  };

  const getItineraryWithMapButtonText = () => {
    if (!formData.include_itineraries || !formData.include_maps) {
      return "+ Add Itinerary with Map (Requires both itineraries and maps)";
    }

    const mapCount = formData.maps?.length || 0;

    const currentCount = formData.content_sections.filter(
      (section) => section.layout.type === "itinerary-with-map",
    ).length;

    if (currentCount >= mapCount) {
      return `+ Add Itinerary with Map (${currentCount}/${mapCount} used)`;
    }

    return `+ Add Itinerary with Map (${currentCount}/${mapCount} available)`;
  };

  return (
    <>
      {/* Content Sections Checkbox */}
      <div className="blog-form-checkbox-section">
        <label className="blog-form-checkbox-label">
          <input
            type="checkbox"
            checked={formData.include_content}
            onChange={(e) => onInputChange("include_content", e.target.checked)}
            className="blog-form-checkbox"
          />
          <span className="blog-form-checkbox-text">
            Include Content Sections
          </span>
        </label>
      </div>

      {/* Content Sections Dynamic Section */}
      {formData.include_content && (
        <div className="blog-form-dynamic-section">
          <div className="blog-form-dynamic-header">
            <h4 className="blog-form-dynamic-title">Content Sections</h4>
            <div className="blog-form-content-buttons">
              <button
                type="button"
                onClick={() => onAddContentSection("text")}
                className="blog-form-add-btn blog-form-add-text-btn"
              >
                + Add Text Section
              </button>
              <button
                type="button"
                onClick={() => onAddContentSection("two-column")}
                className="blog-form-add-btn blog-form-add-column-btn"
              >
                + Add Two-Column Section
              </button>
              <button
                type="button"
                onClick={() => onAddContentSection("image-grid")}
                className="blog-form-add-btn blog-form-add-grid-btn"
              >
                + Add Image Grid
              </button>
              <button
                type="button"
                onClick={() => onAddContentSection("itinerary-with-map")}
                className={`blog-form-add-btn blog-form-add-itinerary-map-btn ${
                  !canAddItineraryWithMap() ? "blog-form-btn-disabled" : ""
                }`}
                disabled={!canAddItineraryWithMap()}
                title={
                  !canAddItineraryWithMap()
                    ? "Requires both itineraries and maps to be enabled, or maximum limit reached"
                    : "Add an itinerary combined with a map"
                }
              >
                {getItineraryWithMapButtonText()}
              </button>
            </div>
          </div>

          {formData.content_sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="blog-form-content-section">
              <div className="blog-form-group-header">
                <h5 className="blog-form-group-title">
                  {getSectionTitle(section.layout.type)} {sectionIndex + 1}
                </h5>
                <button
                  type="button"
                  onClick={() => onRemoveContentSection(sectionIndex)}
                  className="blog-form-remove-btn"
                >
                  Remove
                </button>
              </div>

              {section.layout.type === "text" && (
                <TextContentSection
                  section={section}
                  sectionIndex={sectionIndex}
                  onContentChange={onContentChange}
                  generateKey={generateKey}
                />
              )}

              {section.layout.type === "two-column" && (
                <TwoColumnContentSection
                  section={section}
                  sectionIndex={sectionIndex}
                  onContentChange={onContentChange}
                  generateKey={generateKey}
                />
              )}

              {section.layout.type === "image-grid" && (
                <ImageGridContentSection
                  section={section}
                  sectionIndex={sectionIndex}
                  onContentChange={onContentChange}
                  generateKey={generateKey}
                />
              )}

              {section.layout.type === "itinerary-with-map" && (
                <ItineraryWithMapContentSection
                  section={section}
                  sectionIndex={sectionIndex}
                  onContentChange={onContentChange}
                  generateKey={generateKey}
                  formData={formData}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

ContentSections.propTypes = {
  formData: PropTypes.shape({
    include_content: PropTypes.bool.isRequired,
    include_itineraries: PropTypes.bool.isRequired,
    include_maps: PropTypes.bool.isRequired,
    itineraries: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(PropTypes.string).isRequired,
      }),
    ),
    maps: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }),
    ),
    content_sections: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        layout: PropTypes.shape({
          type: PropTypes.string.isRequired,
        }).isRequired,
        content: PropTypes.string,
      }),
    ).isRequired,
  }).isRequired,
  onInputChange: PropTypes.func.isRequired,
  onContentChange: PropTypes.func.isRequired,
  onAddContentSection: PropTypes.func.isRequired,
  onRemoveContentSection: PropTypes.func.isRequired,
};

export default ContentSections;
