import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FormField from "../FormField/FormField";
import ItinerariesSection from "./FormSections/ItinerariesSection";
import MapsSection from "./FormSections/MapsSection";
import ContentSections from "./FormSections/ContentSections";
import "./BlogGeneratorForm.css";

// Import i18n-iso-countries
const countries = require("i18n-iso-countries");
// Register English language for country names
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

const BlogGeneratorForm = ({
  formData,
  onInputChange,
  onItineraryChange,
  onAddItinerary,
  onRemoveItinerary,
  onAddItineraryItem,
  onRemoveItineraryItem,
  onMapChange,
  onAddMap,
  onRemoveMap,
  onContentChange,
  onAddContentSection,
  onRemoveContentSection,
  onMoveContentSection,
}) => {
  // State for country validation
  const [countryValidation, setCountryValidation] = useState({
    isValid: true,
    message: "",
    countryCode: "",
  });

  // Helper function to validate country and get country code
  const validateCountry = (countryName) => {
    if (!countryName || countryName.trim() === "") {
      return {
        isValid: true,
        message: "",
        countryCode: "",
      };
    }

    const trimmedCountry = countryName.trim();

    // Try to get country code from the entered name
    let countryCode = countries.getAlpha2Code(trimmedCountry, "en");

    if (countryCode) {
      return {
        isValid: true,
        message: `✓ Valid country (${countryCode})`,
        countryCode: countryCode,
      };
    }

    // If direct lookup fails, try some common variations
    const variations = [
      trimmedCountry.toLowerCase(),
      trimmedCountry.toUpperCase(),
      trimmedCountry.charAt(0).toUpperCase() +
        trimmedCountry.slice(1).toLowerCase(),
    ];

    for (const variation of variations) {
      countryCode = countries.getAlpha2Code(variation, "en");
      if (countryCode) {
        return {
          isValid: true,
          message: `✓ Valid country (${countryCode})`,
          countryCode: countryCode,
        };
      }
    }

    return {
      isValid: false,
      message: "⚠️ Country not recognized. Please check spelling.",
      countryCode: "",
    };
  };

  // Helper function to check if country is US
  const isUSCountry = (countryCode) => {
    return countryCode === "US";
  };

  // Update country validation when country changes
  useEffect(() => {
    const validation = validateCountry(formData.country);
    setCountryValidation(validation);

    // Auto-update country code if valid
    if (
      validation.isValid &&
      validation.countryCode &&
      validation.countryCode !== formData.country_code
    ) {
      onInputChange("country_code", validation.countryCode);
    }
  }, [formData.country, formData.country_code, onInputChange]);

  return (
    <div className="blog-form-container">
      <h2 className="blog-form-title">Blog Configuration Form</h2>

      <div className="form-field-container">
        <FormField
          id="country"
          label="Country"
          value={formData.country}
          onChange={(value) => onInputChange("country", value)}
          placeholder="Enter country name (e.g., United States, France, Japan)"
          required
        />
        {countryValidation.message && (
          <div
            className={`country-validation-message ${countryValidation.isValid ? "valid" : "invalid"}`}
          >
            {countryValidation.message}
          </div>
        )}
      </div>

      {/* State field - only show for United States */}
      {isUSCountry(countryValidation.countryCode) && (
        <FormField
          id="state"
          label="State"
          value={formData.state}
          onChange={(value) => onInputChange("state", value)}
          placeholder="Enter state name (e.g., California, New York, Texas)"
          required
        />
      )}

      <FormField
        id="title"
        label="Blog Title"
        value={formData.title}
        onChange={(value) => onInputChange("title", value)}
        placeholder="Enter the blog post title"
        required
      />

      <FormField
        id="blog_description"
        label="Blog Description"
        type="textarea"
        value={formData.blog_description}
        onChange={(value) => onInputChange("blog_description", value)}
        placeholder="This is the text displayed when hovering over the blog post thumbnail on the Home page."
        rows={4}
        required
      />

      <FormField
        id="background_image"
        label="Background Image"
        type="file"
        value={formData.background_image}
        onChange={(value) => onInputChange("background_image", value)}
        accept=".jpg,.jpeg,.JPG,.JPEG,.png,.PNG,.webp,.WEBP,.gif,.GIF"
        required
      />

      <div className="blog-form-section-divider">
        <h3 className="blog-form-section-title">Blog Content Sections</h3>
      </div>

      <FormField
        id="blog_header"
        label="Blog Header"
        value={formData.blog_header}
        onChange={(value) => onInputChange("blog_header", value)}
        placeholder="Enter the main blog header (e.g., 📍🇹🇹 Trinidad & Tobago: A Tale of Two Islands)"
        required
      />

      <FormField
        id="blog_subtitle"
        label="Blog Subtitle"
        value={formData.blog_subtitle}
        onChange={(value) => onInputChange("blog_subtitle", value)}
        placeholder="Enter the blog subtitle (e.g., ⛱️10 days of Caribbean Charm: Uncovering the Soul and Beaches ✨)"
        required
      />

      <FormField
        id="blog_description_detailed"
        label="Blog Description (Detailed)"
        type="textarea"
        value={formData.blog_description_detailed}
        onChange={(value) => onInputChange("blog_description_detailed", value)}
        placeholder="Enter the detailed blog description with HTML links (e.g., Our [Trinidad & Tobago](https://en.wikipedia.org/wiki/Trinidad_and_Tobago) adventure...)"
        rows={6}
        required
      />

      <FormField
        id="blog_tips_section"
        label="Tips Section"
        value={formData.blog_tips_section}
        onChange={(value) => onInputChange("blog_tips_section", value)}
        placeholder="Enter tips section text (e.g., 💥 Insider Tips: Your Key to an Unforgettable Trip (read more…))"
      />

      {formData.blog_tips_section &&
        formData.blog_tips_section.trim() !== "" && (
          <div className="blog-form-section-info">
            <small className="blog-form-help-text">
              💡 <strong>Auto-Generated:</strong> Tips link will automatically
              point to /tips/
              {formData.state
                ? `united-states-${formData.state.toLowerCase().replace(/[^a-z0-9]/g, "-")}`
                : formData.country.toLowerCase().replace(/[^a-z0-9]/g, "-")}
              . A tips page will be created if it doesn't exist.
            </small>
          </div>
        )}

      <div className="blog-form-section-divider">
        <h3 className="blog-form-section-title">Optional Sections</h3>
      </div>

      <ItinerariesSection
        formData={formData}
        onInputChange={onInputChange}
        onItineraryChange={onItineraryChange}
        onAddItinerary={onAddItinerary}
        onRemoveItinerary={onRemoveItinerary}
        onAddItineraryItem={onAddItineraryItem}
        onRemoveItineraryItem={onRemoveItineraryItem}
      />

      <MapsSection
        formData={formData}
        onInputChange={onInputChange}
        onMapChange={onMapChange}
        onAddMap={onAddMap}
        onRemoveMap={onRemoveMap}
      />

      <ContentSections
        formData={formData}
        onInputChange={onInputChange}
        onContentChange={onContentChange}
        onAddContentSection={onAddContentSection}
        onRemoveContentSection={onRemoveContentSection}
        onMoveContentSection={onMoveContentSection}
      />
    </div>
  );
};

BlogGeneratorForm.propTypes = {
  formData: PropTypes.shape({
    country: PropTypes.string.isRequired,
    country_code: PropTypes.string,
    state: PropTypes.string,
    title: PropTypes.string.isRequired,
    blog_description: PropTypes.string.isRequired,
    background_image: PropTypes.object,
    blog_header: PropTypes.string.isRequired,
    blog_subtitle: PropTypes.string.isRequired,
    blog_description_detailed: PropTypes.string.isRequired,
    blog_tips_section: PropTypes.string.isRequired,
    include_itineraries: PropTypes.bool.isRequired,
    itineraries: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(PropTypes.string).isRequired,
      }),
    ).isRequired,
    include_maps: PropTypes.bool.isRequired,
    maps: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }),
    ).isRequired,
    include_content: PropTypes.bool.isRequired,
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
  onItineraryChange: PropTypes.func.isRequired,
  onAddItinerary: PropTypes.func.isRequired,
  onRemoveItinerary: PropTypes.func.isRequired,
  onAddItineraryItem: PropTypes.func.isRequired,
  onRemoveItineraryItem: PropTypes.func.isRequired,
  onMapChange: PropTypes.func.isRequired,
  onAddMap: PropTypes.func.isRequired,
  onRemoveMap: PropTypes.func.isRequired,
  onContentChange: PropTypes.func.isRequired,
  onAddContentSection: PropTypes.func.isRequired,
  onRemoveContentSection: PropTypes.func.isRequired,
  onMoveContentSection: PropTypes.func.isRequired,
};

export default BlogGeneratorForm;
