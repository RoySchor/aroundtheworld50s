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
      } else if (
        key !== "include_itineraries" &&
        key !== "itineraries" &&
        key !== "include_maps" &&
        key !== "maps" &&
        key !== "include_content" &&
        key !== "content_sections" &&
        formData[key] &&
        formData[key].trim() !== ""
      ) {
        // Handle all other fields including blog_description at top level
        filteredData[key] = formData[key].trim();
      }
    });

    // Add itineraries to blog object if enabled and has content
    if (formData.include_itineraries && formData.itineraries.length > 0) {
      const validItineraries = formData.itineraries
        .filter(
          (itinerary) =>
            itinerary.title.trim() !== "" &&
            itinerary.items.some((item) => item.trim() !== ""),
        )
        .map((itinerary) => ({
          title: itinerary.title.trim(),
          items: itinerary.items
            .filter((item) => item.trim() !== "")
            .map((item) => item.trim()),
        }));

      if (validItineraries.length > 0) {
        blogData.itineraries = validItineraries;
      }
    }

    // Add maps to blog object if enabled and has content
    if (formData.include_maps && formData.maps.length > 0) {
      const validMaps = formData.maps
        .filter(
          (map) =>
            map.name.trim() !== "" &&
            map.title.trim() !== "" &&
            map.url.trim() !== "",
        )
        .map((map) => ({
          name: map.name.trim(),
          title: map.title.trim(),
          url: map.url.trim(),
        }));

      if (validMaps.length > 0) {
        blogData.maps = validMaps;
      }
    }

    // Add content sections to blog object if enabled and has content
    if (formData.include_content && formData.content_sections.length > 0) {
      const validContentSections = formData.content_sections
        .filter((section) => {
          // For text and two-column sections, check content
          if (
            section.layout.type === "text" ||
            section.layout.type === "two-column"
          ) {
            return section.content && section.content.trim() !== "";
          }
          // For image-grid sections, check if there are valid images
          if (section.layout.type === "image-grid") {
            return (
              section.images && section.images.some((image) => image !== null)
            );
          }
          // For itinerary-with-map sections, always include (they reference existing data)
          if (section.layout.type === "itinerary-with-map") {
            return true;
          }
          return false;
        })
        .map((section) => {
          const contentSection = {
            key: section.key,
            layout: { ...section.layout },
          };

          // Handle different section types
          if (
            section.layout.type === "text" ||
            section.layout.type === "two-column"
          ) {
            contentSection.content = section.content.trim();
          } else if (
            section.layout.type === "image-grid" ||
            section.layout.type === "itinerary-with-map"
          ) {
            contentSection.content = null;
          }

          // Add image properties for two-column sections
          if (section.layout.type === "two-column" && section.image) {
            if (section.layout.left_type === "image") {
              contentSection.left_image = section.image.name;
            } else if (section.layout.right_type === "image") {
              contentSection.right_image = section.image.name;
            }
          }

          // Add images array for image-grid sections
          if (section.layout.type === "image-grid" && section.images) {
            const validImages = section.images.filter(
              (image) => image !== null,
            );
            if (validImages.length > 0) {
              contentSection.images = validImages.map((image) => image.name);
            }
          }

          return contentSection;
        });

      if (validContentSections.length > 0) {
        blogData.content = validContentSections;
      }
    }

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

    // Add background image file to zip if it exists
    if (formData.background_image) {
      zip.file(formData.background_image.name, formData.background_image);
    }

    // Add content section images to zip if they exist
    if (formData.include_content && formData.content_sections.length > 0) {
      formData.content_sections.forEach((section) => {
        // Add two-column images
        if (section.layout.type === "two-column" && section.image) {
          zip.file(section.image.name, section.image);
        }
        // Add image-grid images
        if (section.layout.type === "image-grid" && section.images) {
          section.images.forEach((image) => {
            if (image !== null) {
              zip.file(image.name, image);
            }
          });
        }
      });
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
};

export default JsonPreview;
