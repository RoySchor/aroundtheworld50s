import React from "react";
import PropTypes from "prop-types";

const ItineraryWithMapContentSection = ({
  section,
  sectionIndex,
  onContentChange,
  generateKey,
  formData,
}) => {
  const handleLayoutChange = (field, value) => {
    onContentChange(sectionIndex, `layout.${field}`, value);
  };

  // Get available maps
  const availableMaps = formData.maps || [];

  return (
    <div className="blog-form-itinerary-map-section">
      {/* Map Selection */}
      <div className="blog-form-selection-group">
        <label className="blog-form-label">Select Map</label>
        <select
          value={section.layout.map_index || 0}
          onChange={(e) =>
            handleLayoutChange("map_index", parseInt(e.target.value))
          }
          className="blog-form-select"
        >
          {availableMaps.map((map, index) => (
            <option key={index} value={index}>
              {map.title || `Map ${index + 1}`}
            </option>
          ))}
        </select>
      </div>

      <div className="blog-form-section-info">
        <small className="blog-form-help-text">
          💡 <strong>Preview:</strong> This will display all itineraries
          alongside "
          {availableMaps[section.layout.map_index || 0]?.title ||
            "Selected map"}
          "
        </small>
      </div>
    </div>
  );
};

ItineraryWithMapContentSection.propTypes = {
  section: PropTypes.shape({
    key: PropTypes.string.isRequired,
    layout: PropTypes.shape({
      type: PropTypes.string.isRequired,
      map_index: PropTypes.number,
    }).isRequired,
    content: PropTypes.string,
  }).isRequired,
  sectionIndex: PropTypes.number.isRequired,
  onContentChange: PropTypes.func.isRequired,
  generateKey: PropTypes.func.isRequired,
  formData: PropTypes.shape({
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
  }).isRequired,
};

export default ItineraryWithMapContentSection;
