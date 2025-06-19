import React from "react";
import PropTypes from "prop-types";
import "./JsonPreview.css";

const JsonPreview = ({ formData }) => {
  const generateJSON = () => {
    const filteredData = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] && formData[key].trim() !== "") {
        filteredData[key] = formData[key].trim();
      }
    });
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

  return (
    <div className="json-preview-container">
      <h2 className="json-preview-title">Generated JSON</h2>
      <div className="json-preview">
        <pre className="json-content">{generateJSON()}</pre>
      </div>
      <button
        onClick={downloadJSON}
        className="json-download-btn"
        disabled={!formData.country.trim()}
      >
        Download JSON
      </button>
    </div>
  );
};

JsonPreview.propTypes = {
  formData: PropTypes.shape({
    country: PropTypes.string.isRequired,
    country_code: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    blog_description: PropTypes.string.isRequired,
  }).isRequired,
};

export default JsonPreview;
