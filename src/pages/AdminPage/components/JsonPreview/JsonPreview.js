import React from "react";
import PropTypes from "prop-types";
import JSZip from "jszip";
import "./JsonPreview.css";

const JsonPreview = ({ formData }) => {
  const isFormValid = () => {
    const requiredFields = [
      "country",
      "country_code",
      "title",
      "blog_description",
      "blog_header",
      "blog_subtitle",
      "blog_description_detailed",
      "blog_tips_section",
    ];

    return requiredFields.every(
      (field) => formData[field] && formData[field].trim() !== "",
    );
  };

  const generateJSON = () => {
    const filteredData = {};
    const blogData = {};

    Object.keys(formData).forEach((key) => {
      if (key === "background_image") {
        if (formData[key]) {
          filteredData[key] = formData[key].name;
        }
      } else if (
        key === "blog_header" ||
        key === "blog_subtitle" ||
        key === "blog_description_detailed" ||
        key === "blog_tips_section"
      ) {
        // Handle blog section fields that go into the blog hash
        const blogKey = key.replace("blog_", "");
        const mappedKey =
          blogKey === "description_detailed"
            ? "description"
            : blogKey === "tips_section"
              ? "tips_section"
              : blogKey;

        if (formData[key] && formData[key].trim() !== "") {
          blogData[mappedKey] = formData[key].trim();
        }
      } else if (formData[key] && formData[key].trim() !== "") {
        // Handle all other fields including blog_description at top level
        filteredData[key] = formData[key].trim();
      }
    });

    // Add blog object if it has content
    if (Object.keys(blogData).length > 0) {
      filteredData.blog = blogData;
    }

    return JSON.stringify(filteredData, null, 2);
  };

  const downloadJSON = () => {
    const jsonString = generateJSON();
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const country = formData.country.trim();
    const title = formData.title.trim();
    let filename = "blog-config.json";

    if (country && title) {
      const sanitizedCountry = country.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "-");
      filename = `${sanitizedCountry}-${sanitizedTitle}-config.json`;
    } else if (country) {
      const sanitizedCountry = country.toLowerCase().replace(/[^a-z0-9]/g, "-");
      filename = `${sanitizedCountry}-config.json`;
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadFolder = async () => {
    const zip = new JSZip();
    const jsonString = generateJSON();

    // Add JSON file to zip
    const country = formData.country.trim();
    const title = formData.title.trim();
    let jsonFilename = "blog-config.json";

    if (country && title) {
      const sanitizedCountry = country.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "-");
      jsonFilename = `${sanitizedCountry}-${sanitizedTitle}-config.json`;
    } else if (country) {
      const sanitizedCountry = country.toLowerCase().replace(/[^a-z0-9]/g, "-");
      jsonFilename = `${sanitizedCountry}-config.json`;
    }

    zip.file(jsonFilename, jsonString);

    // Add image file to zip if it exists
    if (formData.background_image) {
      zip.file(formData.background_image.name, formData.background_image);
    }

    // Generate zip file and download
    try {
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);

      let folderName = "blog-folder.zip";
      if (country && title) {
        const sanitizedCountry = country
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-");
        const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "-");
        folderName = `${sanitizedCountry}-${sanitizedTitle}-folder.zip`;
      } else if (country) {
        const sanitizedCountry = country
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-");
        folderName = `${sanitizedCountry}-folder.zip`;
      }

      const link = document.createElement("a");
      link.href = url;
      link.download = folderName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error creating zip file:", error);
    }
  };

  return (
    <div className="json-preview-container">
      <h2 className="json-preview-title">Generated JSON</h2>
      <div className="json-preview">
        <pre className="json-content">{generateJSON()}</pre>
      </div>
      <div className="json-buttons-container">
        <button
          onClick={downloadJSON}
          className="json-download-btn"
          disabled={!isFormValid()}
        >
          Download JSON
        </button>
        <button
          onClick={downloadFolder}
          className="json-download-btn json-download-folder-btn"
          disabled={!isFormValid()}
        >
          Download Folder
        </button>
      </div>
    </div>
  );
};

JsonPreview.propTypes = {
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
};

export default JsonPreview;
