import React, { useState } from "react";
import FormField from "./components/FormField/FormField";
import JsonPreview from "./components/JsonPreview/JsonPreview";
import "./AdminPage.css";

const AdminPage = () => {
  const [formData, setFormData] = useState({
    country: "",
    country_code: "",
    title: "",
    blog_description: "",
    background_image: null,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="page-container admin">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Blog Generator</h1>
        <p className="admin-page-subtitle">
          Create the necessary configuration for a new blog post
        </p>
      </div>

      <div className="admin-two-column-layout">
        <div className="admin-column admin-left-column">
          <div className="admin-form-container">
            <h2 className="admin-form-title">Blog Configuration Form</h2>

            <FormField
              id="country"
              label="Country"
              value={formData.country}
              onChange={(value) => handleInputChange("country", value)}
              placeholder="Enter country name"
              required
            />

            <FormField
              id="country_code"
              label="Country Code"
              value={formData.country_code}
              onChange={(value) => handleInputChange("country_code", value)}
              placeholder="Enter country code (e.g., US, FR, JP)"
              maxLength={3}
              required
            />

            <FormField
              id="title"
              label="Blog Title"
              value={formData.title}
              onChange={(value) => handleInputChange("title", value)}
              placeholder="Enter the blog post title"
              required
            />

            <FormField
              id="blog_description"
              label="Blog Description"
              type="textarea"
              value={formData.blog_description}
              onChange={(value) => handleInputChange("blog_description", value)}
              placeholder="Enter a brief description of the blog post"
              rows={4}
              required
            />

            <FormField
              id="background_image"
              label="Background Image"
              type="file"
              value={formData.background_image}
              onChange={(value) => handleInputChange("background_image", value)}
              accept=".jpg,.jpeg,.png,.webp,.gif"
            />
          </div>
        </div>

        <div className="admin-column admin-right-column">
          <JsonPreview formData={formData} />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
