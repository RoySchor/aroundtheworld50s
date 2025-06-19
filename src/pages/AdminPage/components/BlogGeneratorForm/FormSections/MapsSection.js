import React from "react";
import PropTypes from "prop-types";
import FormField from "../../FormField/FormField";

const MapsSection = ({
  formData,
  onInputChange,
  onMapChange,
  onAddMap,
  onRemoveMap,
}) => {
  return (
    <>
      {/* Maps Checkbox */}
      <div className="blog-form-checkbox-section">
        <label className="blog-form-checkbox-label">
          <input
            type="checkbox"
            checked={formData.include_maps}
            onChange={(e) => onInputChange("include_maps", e.target.checked)}
            className="blog-form-checkbox"
          />
          <span className="blog-form-checkbox-text">Include Maps</span>
        </label>
      </div>

      {/* Maps Dynamic Section */}
      {formData.include_maps && (
        <div className="blog-form-dynamic-section">
          <div className="blog-form-dynamic-header">
            <h4 className="blog-form-dynamic-title">Maps</h4>
            <button
              type="button"
              onClick={onAddMap}
              className="blog-form-add-btn"
            >
              + Add Map
            </button>
          </div>

          {formData.maps.map((map, mapIndex) => (
            <div key={mapIndex} className="blog-form-map-group">
              <div className="blog-form-group-header">
                <h5 className="blog-form-group-title">Map {mapIndex + 1}</h5>
                {formData.maps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveMap(mapIndex)}
                    className="blog-form-remove-btn"
                  >
                    Remove
                  </button>
                )}
              </div>

              <FormField
                id={`map_name_${mapIndex}`}
                label="Map Name"
                value={map.name}
                onChange={(value) => onMapChange(mapIndex, "name", value)}
                placeholder="Enter map name (e.g., cityMap)"
              />

              <FormField
                id={`map_title_${mapIndex}`}
                label="Map Title"
                value={map.title}
                onChange={(value) => onMapChange(mapIndex, "title", value)}
                placeholder="Enter map title (e.g., City Center Map)"
              />

              <FormField
                id={`map_url_${mapIndex}`}
                label="Map URL"
                type="textarea"
                value={map.url}
                onChange={(value) => onMapChange(mapIndex, "url", value)}
                placeholder="Enter Google Maps embed URL"
                rows={3}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

MapsSection.propTypes = {
  formData: PropTypes.shape({
    include_maps: PropTypes.bool.isRequired,
    maps: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  onInputChange: PropTypes.func.isRequired,
  onMapChange: PropTypes.func.isRequired,
  onAddMap: PropTypes.func.isRequired,
  onRemoveMap: PropTypes.func.isRequired,
};

export default MapsSection;
