import React from "react";
import PropTypes from "prop-types";
import FormField from "../FormField/FormField";
import "./BlogGeneratorForm.css";

const BlogGeneratorForm = ({ formData, onInputChange }) => {
  return (
    <div className="blog-form-container">
      <h2 className="blog-form-title">Blog Configuration Form</h2>

      <FormField
        id="country"
        label="Country"
        value={formData.country}
        onChange={(value) => onInputChange("country", value)}
        placeholder="Enter country name"
        required
      />

      <FormField
        id="country_code"
        label="Country Code"
        value={formData.country_code}
        onChange={(value) => onInputChange("country_code", value)}
        placeholder="Enter country code (e.g., US, FR, JP)"
        maxLength={3}
        required
      />

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
        placeholder="Enter a brief description of the blog post"
        rows={4}
        required
      />

      <FormField
        id="background_image"
        label="Background Image"
        type="file"
        value={formData.background_image}
        onChange={(value) => onInputChange("background_image", value)}
        accept=".jpg,.jpeg,.png,.webp,.gif"
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
        placeholder="Enter the detailed blog description with HTML links (e.g., Our <a href='...' className='post-link'>Trinidad & Tobago</a> adventure...)"
        rows={6}
        required
      />

      <FormField
        id="blog_tips_section"
        label="Tips Section"
        value={formData.blog_tips_section}
        onChange={(value) => onInputChange("blog_tips_section", value)}
        placeholder="Enter tips section text (e.g., 💥 Insider Tips: Your Key to an Unforgettable Trip (read more…))"
        required
      />
    </div>
  );
};

BlogGeneratorForm.propTypes = {
  formData: PropTypes.shape({
    country: PropTypes.string.isRequired,
    country_code: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    blog_description: PropTypes.string.isRequired,
    background_image: PropTypes.object,
    blog_header: PropTypes.string.isRequired,
    blog_subtitle: PropTypes.string.isRequired,
    blog_description_detailed: PropTypes.string.isRequired,
    blog_tips_section: PropTypes.string.isRequired,
  }).isRequired,
  onInputChange: PropTypes.func.isRequired,
};

export default BlogGeneratorForm;
