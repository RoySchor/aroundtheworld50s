import React, { useState } from "react";
import BlogGeneratorForm from "./components/BlogGeneratorForm/BlogGeneratorForm";
import JsonPreview from "./components/JsonPreview/JsonPreview";
import "./AdminPage.css";

const AdminPage = () => {
  const [formData, setFormData] = useState({
    country: "",
    country_code: "",
    title: "",
    blog_description: "",
    background_image: null,
    blog_header: "",
    blog_subtitle: "",
    blog_description_detailed: "",
    blog_tips_section: "",
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
          <BlogGeneratorForm
            formData={formData}
            onInputChange={handleInputChange}
          />
        </div>

        <div className="admin-column admin-right-column">
          <JsonPreview formData={formData} />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
