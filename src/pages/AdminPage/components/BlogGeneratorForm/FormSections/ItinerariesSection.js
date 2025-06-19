import React from "react";
import PropTypes from "prop-types";
import FormField from "../../FormField/FormField";

const ItinerariesSection = ({
  formData,
  onInputChange,
  onItineraryChange,
  onAddItinerary,
  onRemoveItinerary,
  onAddItineraryItem,
  onRemoveItineraryItem,
}) => {
  const handleItineraryItemChange = (itineraryIndex, itemIndex, value) => {
    const updatedItems = [...formData.itineraries[itineraryIndex].items];
    updatedItems[itemIndex] = value;
    onItineraryChange(itineraryIndex, "items", updatedItems);
  };

  return (
    <>
      {/* Itineraries Checkbox */}
      <div className="blog-form-checkbox-section">
        <label className="blog-form-checkbox-label">
          <input
            type="checkbox"
            checked={formData.include_itineraries}
            onChange={(e) =>
              onInputChange("include_itineraries", e.target.checked)
            }
            className="blog-form-checkbox"
          />
          <span className="blog-form-checkbox-text">Include Itineraries</span>
        </label>
      </div>

      {/* Itineraries Dynamic Section */}
      {formData.include_itineraries && (
        <div className="blog-form-dynamic-section">
          <div className="blog-form-dynamic-header">
            <h4 className="blog-form-dynamic-title">Itineraries</h4>
            <button
              type="button"
              onClick={onAddItinerary}
              className="blog-form-add-btn"
            >
              + Add Itinerary
            </button>
          </div>

          {formData.itineraries.map((itinerary, itineraryIndex) => (
            <div key={itineraryIndex} className="blog-form-itinerary-group">
              <div className="blog-form-group-header">
                <h5 className="blog-form-group-title">
                  Itinerary {itineraryIndex + 1}
                </h5>
                {formData.itineraries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveItinerary(itineraryIndex)}
                    className="blog-form-remove-btn"
                  >
                    Remove
                  </button>
                )}
              </div>

              <FormField
                id={`itinerary_title_${itineraryIndex}`}
                label="Itinerary Title"
                value={itinerary.title}
                onChange={(value) =>
                  onItineraryChange(itineraryIndex, "title", value)
                }
                placeholder="Enter itinerary title (e.g., Day 1 Itinerary 📍)"
              />

              <div className="blog-form-items-section">
                <div className="blog-form-items-header">
                  <label className="blog-form-label">Itinerary Items</label>
                  <button
                    type="button"
                    onClick={() => onAddItineraryItem(itineraryIndex)}
                    className="blog-form-add-item-btn"
                  >
                    + Add Item
                  </button>
                </div>

                {itinerary.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="blog-form-item-row">
                    <FormField
                      id={`itinerary_${itineraryIndex}_item_${itemIndex}`}
                      label={`Item ${itemIndex + 1}`}
                      value={item}
                      onChange={(value) =>
                        handleItineraryItemChange(
                          itineraryIndex,
                          itemIndex,
                          value,
                        )
                      }
                      placeholder="Enter itinerary item (e.g., 📌 Hotel Check-in)"
                    />
                    {itinerary.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          onRemoveItineraryItem(itineraryIndex, itemIndex)
                        }
                        className="blog-form-remove-item-btn"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

ItinerariesSection.propTypes = {
  formData: PropTypes.shape({
    include_itineraries: PropTypes.bool.isRequired,
    itineraries: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(PropTypes.string).isRequired,
      }),
    ).isRequired,
  }).isRequired,
  onInputChange: PropTypes.func.isRequired,
  onItineraryChange: PropTypes.func.isRequired,
  onAddItinerary: PropTypes.func.isRequired,
  onRemoveItinerary: PropTypes.func.isRequired,
  onAddItineraryItem: PropTypes.func.isRequired,
  onRemoveItineraryItem: PropTypes.func.isRequired,
};

export default ItinerariesSection;
