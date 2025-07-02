import React, { useState } from "react";
import PropTypes from "prop-types";
import JSZip from "jszip";
import "./JsonPreview.css";

const JsonPreview = ({ formData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [instructionsData, setInstructionsData] = useState({});

  const isUSCountry = (countryCode) => {
    return countryCode === "US";
  };

  const isFormValid = () => {
    const requiredFields = [
      "country",
      "country_code",
      "title",
      "blog_description",
      "blog_header",
      "blog_subtitle",
      "blog_description_detailed",
    ];

    const textFieldsValid = requiredFields.every(
      (field) => formData[field] && formData[field].trim() !== "",
    );

    const backgroundImageValid =
      formData.background_image && formData.background_image.name;

    const stateValid = () => {
      const isUS = isUSCountry(formData.country_code);

      if (isUS) {
        return formData.state && formData.state.trim() !== "";
      }
      return true;
    };

    const contentSectionsValid = () => {
      if (
        !formData.include_content ||
        !formData.content_sections ||
        formData.content_sections.length === 0
      ) {
        return false;
      }

      return formData.content_sections.some((section) => {
        if (
          section.layout.type === "text" ||
          section.layout.type === "two-column"
        ) {
          return section.content && section.content.trim() !== "";
        }
        if (section.layout.type === "image-grid") {
          return (
            section.images && section.images.some((image) => image !== null)
          );
        }
        if (section.layout.type === "itinerary-with-map") {
          return true;
        }
        return false;
      });
    };

    return (
      textFieldsValid &&
      backgroundImageValid &&
      stateValid() &&
      contentSectionsValid()
    );
  };

  const generateJSON = () => {
    const filteredData = {};
    const blogData = {};

    Object.keys(formData).forEach((key) => {
      if (key === "background_image") {
        if (formData[key] && formData[key].name) {
          filteredData[key] = formData[key].name;
        }
      } else if (key === "country") {
        if (isUSCountry(formData.country_code)) {
          filteredData[key] = "United States";
        } else {
          filteredData[key] = formData[key].trim();
        }
      } else if (key === "country_code") {
        if (isUSCountry(formData[key])) {
          filteredData[key] = "US";
        } else {
          filteredData[key] = formData[key].trim();
        }
      } else if (
        key === "blog_header" ||
        key === "blog_subtitle" ||
        key === "blog_description_detailed" ||
        key === "blog_tips_section" ||
        key === "blog_tips_link"
      ) {
        // Handle blog section fields that go into the blog hash
        const blogKey = key.replace("blog_", "");
        const mappedKey =
          blogKey === "description_detailed"
            ? "description"
            : blogKey === "tips_section"
              ? "tips_section"
              : blogKey === "tips_link"
                ? "tips_link"
                : blogKey;

        // Always include tips_section even if empty, but trim other fields
        if (key === "blog_tips_section") {
          blogData[mappedKey] = formData[key] ? formData[key].trim() : "";
          // Auto-generate tips_link if tips_section is provided
          if (formData[key] && formData[key].trim() !== "") {
            const isUSCountry = formData.country_code === "US";
            let tipsPath;
            if (formData.state && isUSCountry) {
              const serializedState = formData.state
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-");
              tipsPath = `/tips/united-states-${serializedState}`;
            } else {
              tipsPath = `/tips/${formData.country.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
            }
            blogData["tips_link"] = tipsPath;
          }
        } else if (formData[key] && formData[key].trim() !== "") {
          blogData[mappedKey] = formData[key].trim();
        }
      } else if (
        key !== "include_itineraries" &&
        key !== "itineraries" &&
        key !== "include_maps" &&
        key !== "maps" &&
        key !== "include_content" &&
        key !== "content_sections" &&
        key !== "state" &&
        formData[key] &&
        formData[key].trim() !== ""
      ) {
        filteredData[key] = formData[key].trim();
      }
    });

    if (formData.state && formData.state.trim() !== "") {
      filteredData.state = formData.state.trim();
    }

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
          // For instagram and itinerary-with-map sections, always include them
          if (
            section.layout.type === "itinerary-with-map" ||
            section.layout.type === "instagram"
          ) {
            return true;
          }
          return false;
        })
        .map((section) => {
          const contentSection = {
            key: section.key,
            layout: { ...section.layout },
          };

          if (
            section.layout.type === "text" ||
            section.layout.type === "two-column"
          ) {
            contentSection.content = section.content.trim();
          } else if (
            section.layout.type === "image-grid" ||
            section.layout.type === "itinerary-with-map" ||
            section.layout.type === "instagram"
          ) {
            contentSection.content = null;
          }

          if (
            section.layout.type === "two-column" &&
            section.image &&
            section.image.name
          ) {
            if (section.layout.left_type === "image") {
              contentSection.left_image = section.image.name;
            } else if (section.layout.right_type === "image") {
              contentSection.right_image = section.image.name;
            }
          }

          if (section.layout.type === "image-grid" && section.images) {
            const validImages = section.images.filter(
              (image) => image !== null && image.name,
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

    if (Object.keys(blogData).length > 0) {
      filteredData.blog = blogData;
    }

    return JSON.stringify(filteredData, null, 2);
  };

  const downloadFolder = async () => {
    const zip = new JSZip();
    const jsonString = generateJSON();

    // Add JSON file to zip
    const country = formData.country.trim();
    let jsonFilename = "blog-config.json";

    if (country) {
      // For US state blogs, use usa-state format
      if (isUSCountry(formData.country_code) && formData.state) {
        const sanitizedState = formData.state
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-");
        jsonFilename = `usa-${sanitizedState}.json`;
      } else {
        // For country blogs, use country name
        const sanitizedCountry = country
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-");
        jsonFilename = `${sanitizedCountry}.json`;
      }
    }

    zip.file(jsonFilename, jsonString);

    // Function to safely read a file and add it to the zip
    const addFileToZip = async (file, filename) => {
      if (!file || !filename) return;

      try {
        // Read the file as an ArrayBuffer
        const arrayBuffer = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsArrayBuffer(file);
        });

        zip.file(filename, arrayBuffer);
      } catch (error) {
        console.warn(`Warning: Could not add file ${filename} to zip:`, error);
      }
    };

    // Add background image file to zip if it exists
    if (formData.background_image && formData.background_image.name) {
      await addFileToZip(
        formData.background_image,
        formData.background_image.name,
      );
    }

    // Add content section images to zip if they exist
    if (formData.include_content && formData.content_sections.length > 0) {
      for (const section of formData.content_sections) {
        // Add two-column images
        if (
          section.layout.type === "two-column" &&
          section.image &&
          section.image.name
        ) {
          await addFileToZip(section.image, section.image.name);
        }
        // Add image-grid images
        if (section.layout.type === "image-grid" && section.images) {
          for (const image of section.images) {
            if (image !== null && image.name) {
              await addFileToZip(image, image.name);
            }
          }
        }
      }
    }

    // Generate zip file and download
    try {
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);

      let folderName = "blog-folder.zip";
      if (country) {
        const sanitizedCountry = country
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-");

        // For US state blogs, include state in the name
        if (isUSCountry(formData.country_code) && formData.state) {
          const sanitizedState = formData.state
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-");
          folderName = `usa-${sanitizedState}-blog.zip`;
        } else {
          folderName = `${sanitizedCountry}-blog.zip`;
        }
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
      throw error; // Re-throw to be caught by the caller
    }
  };

  const handleGenerateBlog = () => {
    setShowConfirmation(true);
  };

  const handleConfirmGenerate = async () => {
    setShowConfirmation(false);
    setIsGenerating(true);

    try {
      // Download the folder
      await downloadFolder();

      // Wait a moment for the download to complete
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get folder name for the script
      const country = formData.country.trim();
      let folderName = "blog-folder";

      if (country) {
        const sanitizedCountry = country
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-");

        if (isUSCountry(formData.country_code) && formData.state) {
          const sanitizedState = formData.state
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-");
          folderName = `usa-${sanitizedState}-blog`;
        } else {
          folderName = `${sanitizedCountry}-blog`;
        }
      }

      // Show custom instructions modal
      setInstructionsData({
        folderName,
        command: `scripts/blog_management/generate`,
      });
      setShowInstructions(true);
    } catch (error) {
      console.error("Error generating blog:", error);
      setInstructionsData({
        error: true,
        message:
          "Error generating blog. Please try again or download the folder manually.",
      });
      setShowInstructions(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCancelGenerate = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="json-preview-container">
      <h2 className="json-preview-title">Generated JSON</h2>
      <div className="json-preview">
        <pre className="json-content">{generateJSON()}</pre>
      </div>

      {/* Form Validation Status */}
      {!isFormValid() && (
        <div className="json-validation-status">
          <h3 className="json-validation-title">⚠️ Form Validation</h3>
          <p className="json-validation-message">
            Please complete all required fields
            {isUSCountry(formData.country_code)
              ? " (including state for US blogs)"
              : ""}{" "}
            and add at least one content section before generating your blog.
          </p>
        </div>
      )}

      <div className="json-buttons-container">
        <button
          onClick={handleGenerateBlog}
          className="json-download-btn json-generate-blog-btn"
          disabled={!isFormValid() || isGenerating}
        >
          {isGenerating ? (
            <>
              <span className="json-btn-spinner"></span>
              Generating...
            </>
          ) : (
            <>🚀 Generate Blog</>
          )}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="json-confirmation-overlay">
          <div className="json-confirmation-modal">
            <div className="json-confirmation-header">
              <h3 className="json-confirmation-title">
                🚀 Ready to Generate Blog?
              </h3>
            </div>
            <div className="json-confirmation-content">
              <p className="json-confirmation-text">
                Please double-check that you have added everything you want for
                your blog post:
              </p>
              <ul className="json-confirmation-checklist">
                <li>✅ Country and title information</li>
                <li>✅ Blog content and descriptions</li>
                <li>✅ Background image uploaded</li>
                <li>✅ Content sections added (required)</li>
                {formData.include_itineraries && (
                  <li>✅ Itineraries configured</li>
                )}
                {formData.include_maps && <li>✅ Maps configured</li>}
              </ul>
              <p className="json-confirmation-warning">
                ⚠️ This will download the blog folder and provide instructions
                to run the generation script.
              </p>
            </div>
            <div className="json-confirmation-buttons">
              <button
                onClick={handleCancelGenerate}
                className="json-confirmation-btn json-confirmation-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmGenerate}
                className="json-confirmation-btn json-confirmation-confirm"
              >
                Yes, Generate Blog!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="json-confirmation-overlay">
          <div className="json-instructions-modal">
            <div className="json-instructions-header">
              <h3 className="json-instructions-title">
                {instructionsData.error ? "❌ Error" : "✅ Blog Package Ready!"}
              </h3>
            </div>
            <div className="json-instructions-content">
              {instructionsData.error ? (
                <div className="json-error-content">
                  <p className="json-error-text">{instructionsData.message}</p>
                </div>
              ) : (
                <div className="json-success-content">
                  <p className="json-instructions-text">
                    Your <strong>{instructionsData.folderName}.zip</strong> has
                    been downloaded! Please move it to your Desktop if it's not
                    there already.
                  </p>

                  <div className="json-command-section">
                    <h4 className="json-command-title">
                      🚀 Final Step - Run These Commands:
                    </h4>
                    <p className="text-sm text-red-600 mb-4">
                      ⚠️ Important: These commands must be run from the project
                      root directory
                    </p>
                    <div className="json-command-box">
                      <code className="json-command-text">
                        {instructionsData.command}
                      </code>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(
                            instructionsData.command,
                          )
                        }
                        className="json-copy-btn"
                        title="Copy to clipboard"
                      >
                        📋 Copy
                      </button>
                    </div>
                  </div>

                  <div className="json-automation-info">
                    <h4 className="json-automation-title">
                      ✨ This will automatically:
                    </h4>
                    <ul className="json-automation-list">
                      <li>Find your {instructionsData.folderName}.zip file</li>
                      <li>Unzip it to Desktop</li>
                      <li>Run the blog generation script</li>
                      <li>Clean up the zip file</li>
                    </ul>
                  </div>

                  <div className="json-instructions-tip">
                    <p>
                      💡 <strong>Tip:</strong> Open Terminal and paste the
                      command above!
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="json-instructions-buttons">
              <button
                onClick={() => setShowInstructions(false)}
                className="json-instructions-btn json-instructions-close"
              >
                {instructionsData.error ? "Close" : "Got it!"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

JsonPreview.propTypes = {
  formData: PropTypes.shape({
    country: PropTypes.string.isRequired,
    country_code: PropTypes.string.isRequired,
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
};

export default JsonPreview;
