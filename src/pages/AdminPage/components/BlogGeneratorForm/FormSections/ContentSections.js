import React from "react";
import PropTypes from "prop-types";
import TextContentSection from "./TextContentSection";
import TwoColumnContentSection from "./TwoColumnContentSection";
import ImageGridContentSection from "./ImageGridContentSection";
import ItineraryWithMapContentSection from "./ItineraryWithMapContentSection";
import InstagramContentSection from "./InstagramContentSection";

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
      case "instagram":
        return "Instagram Feed Section";
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

  // Check if Instagram section can be added
  const canAddInstagram = () => {
    const instagramCount = formData.content_sections.filter(
      (section) => section.layout.type === "instagram",
    ).length;

    return instagramCount === 0;
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

  const hasValidContentSections = () => {
    if (!formData.content_sections || formData.content_sections.length === 0) {
      return false;
    }

    return formData.content_sections.some((section) => {
      if (
        section.layout.type === "text" ||
        section.layout.type === "two-column"
      ) {
        return section.content && section.content.trim() !== "";
      }
      if (section.layout.type === "image-grid") {
        return section.images && section.images.some((image) => image !== null);
      }
      if (
        section.layout.type === "itinerary-with-map" ||
        section.layout.type === "instagram"
      ) {
        return true;
      }
      return false;
    });
  };

  return (
    <>
      <div className="blog-form-required-section">
        <div className="blog-form-required-header">
          <h4 className="blog-form-required-title">Content Sections *</h4>
          <span className="blog-form-required-badge">Required</span>
        </div>
        <p className="blog-form-required-description">
          At least one content section is required for your blog post.
        </p>

        {!hasValidContentSections() && (
          <div className="blog-form-validation-error">
            ⚠️ Please add at least one content section with valid content to
            continue.
          </div>
        )}
      </div>

      <div className="blog-form-dynamic-section">
        <div className="blog-form-dynamic-header">
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
            <button
              type="button"
              onClick={() => onAddContentSection("instagram")}
              className={`blog-form-add-btn blog-form-add-instagram-btn ${
                !canAddInstagram() ? "blog-form-btn-disabled" : ""
              }`}
              disabled={!canAddInstagram()}
              title={
                !canAddInstagram()
                  ? "Only one Instagram feed section is allowed per blog post"
                  : "Add your Instagram feed"
              }
            >
              + Add Instagram Feed
            </button>
          </div>
        </div>

        {formData.content_sections.length === 0 ? (
          <div className="blog-form-empty-content">
            <div className="blog-form-empty-icon">📝</div>
            <p className="blog-form-empty-text">
              No content sections added yet. Click one of the buttons above to
              get started!
            </p>
          </div>
        ) : (
          formData.content_sections.map((section, sectionIndex) => (
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

              {section.layout.type === "instagram" && (
                <InstagramContentSection
                  section={section}
                  sectionIndex={sectionIndex}
                  onContentChange={onContentChange}
                  generateKey={generateKey}
                />
              )}
            </div>
          ))
        )}
      </div>
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
