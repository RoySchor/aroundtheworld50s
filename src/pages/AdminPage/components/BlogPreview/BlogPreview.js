import React, { useMemo, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "../../../../styles/layout.css";
import "../../../BlogPage/Blogs/BlogPost.css";
import "./BlogPreview.css";
import TwoColumnLayout from "../../../../components/TwoColumnLayout/TwoColumnLayout";
import MapEmbed from "../../../../components/MapEmbed/MapEmbed";
import InstagramEmbedSection from "../../../../pages/HomePage/components/InstagramEmbedSection";

const BlogPreview = ({ formData }) => {
  const imageUrlCache = useRef(new Map());

  useEffect(() => {
    const cache = imageUrlCache.current;
    return () => {
      cache.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
      cache.clear();
    };
  }, []);

  const getPlaceholderContent = (field, value) => {
    if (value && value.trim() !== "") return value;

    const placeholders = {
      blog_header: "📍🌍 Your Amazing Destination",
      blog_subtitle: "✨ Discover the magic of your journey",
      blog_description_detailed:
        "Your detailed blog description will appear here. Share your amazing travel experiences and adventures with your readers.",
      blog_tips_section: "💥 Insider Tips: Your Key to an Unforgettable Trip",
      blog_tips_link: "https://example.com/tips",
      country: "Your Destination",
      title: "Your Blog Post Title",
    };

    return placeholders[field] || "";
  };

  // Helper function to get preview image URL with caching
  const getPreviewImageUrl = (imageFile) => {
    if (imageFile && imageFile instanceof File) {
      const cacheKey = `bg_${imageFile.name}_${imageFile.size}_${imageFile.lastModified}`;

      if (!imageUrlCache.current.has(cacheKey)) {
        const url = URL.createObjectURL(imageFile);
        imageUrlCache.current.set(cacheKey, url);
      }

      return imageUrlCache.current.get(cacheKey);
    }
    return "https://via.placeholder.com/800x400/e5e7eb/6b7280?text=Upload+Background+Image";
  };

  // Helper function to get content section preview image with caching
  const getContentImageUrl = (imageFile) => {
    if (imageFile && imageFile instanceof File) {
      const cacheKey = `content_${imageFile.name}_${imageFile.size}_${imageFile.lastModified}`;

      if (!imageUrlCache.current.has(cacheKey)) {
        const url = URL.createObjectURL(imageFile);
        imageUrlCache.current.set(cacheKey, url);
      }

      return imageUrlCache.current.get(cacheKey);
    }
    return "https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Upload+Image";
  };

  // Memoize the preview to avoid unnecessary re-renders
  const previewContent = useMemo(() => {
    const renderContentSection = (section, index) => {
      switch (section.layout.type) {
        case "text":
          return (
            <div
              key={section.key || index}
              className="post-description"
              dangerouslySetInnerHTML={{
                __html:
                  section.content ||
                  "<p>Your text content will appear here...</p>",
              }}
            />
          );

        case "image-grid": {
          const gridImages = section.images || [];
          const previewImages = gridImages.map((image) =>
            image
              ? getContentImageUrl(image)
              : "https://via.placeholder.com/300x200/e5e7eb/6b7280?text=Image",
          );

          return (
            <div key={section.key || index} className="preview-image-grid">
              <div className="image-grid">
                {previewImages.map((imageUrl, imgIndex) => (
                  <div key={imgIndex} className="image-grid-item">
                    <img
                      src={imageUrl}
                      alt={`Gallery ${imgIndex + 1}`}
                      className="image-grid-image"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        }

        case "two-column": {
          const leftContent =
            section.layout.left_type === "text" ? section.content : null;
          const rightContent =
            section.layout.right_type === "text" ? section.content : null;
          const leftImage =
            section.layout.left_type === "image" ? section.image : null;
          const rightImage =
            section.layout.right_type === "image" ? section.image : null;

          return (
            <TwoColumnLayout
              leftPane={{
                type: section.layout.left_type,
                imageUrl: leftImage
                  ? URL.createObjectURL(leftImage)
                  : undefined,
                imageAlt: section.layout.image_alt,
                content: leftContent,
              }}
              rightPane={{
                type: section.layout.right_type,
                imageUrl: rightImage
                  ? URL.createObjectURL(rightImage)
                  : undefined,
                imageAlt: section.layout.image_alt,
                content: rightContent,
              }}
            />
          );
        }

        case "itinerary-with-map": {
          const itinerary = formData.itineraries[section.layout.map_index];
          const map = formData.maps[section.layout.map_index];

          return (
            <TwoColumnLayout
              leftPane={{
                type: "list",
                listTitle: itinerary.title,
                listItems: itinerary.items,
              }}
              rightPane={{
                type: "map",
                mapComponent: <MapEmbed title={map.title} url={map.url} />,
              }}
            />
          );
        }

        case "instagram":
          return <InstagramEmbedSection />;

        default:
          return null;
      }
    };
    const backgroundImageUrl = getPreviewImageUrl(formData.background_image);
    const headerText = getPlaceholderContent(
      "blog_header",
      formData.blog_header,
    );
    const titleText = getPlaceholderContent("title", formData.title);
    const subtitleText = getPlaceholderContent(
      "blog_subtitle",
      formData.blog_subtitle,
    );
    const descriptionText = getPlaceholderContent(
      "blog_description_detailed",
      formData.blog_description_detailed,
    );
    const tipsText = getPlaceholderContent(
      "blog_tips_section",
      formData.blog_tips_section,
    );

    return (
      <div className="blog-preview-container">
        <div className="blog-preview-content">
          {/* Hero Section */}
          <div
            className="fixed-background-container preview-hero"
            style={{
              backgroundImage: `url(${backgroundImageUrl})`,
            }}
          >
            <div className="fixed-background-text-container">
              <div className="fixed-background-title fixed-background-no-margin">
                {headerText}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="container preview-container">
            <div className="page-content">
              <div className="post-title">{titleText}</div>

              <div className="post-subtitle">{subtitleText}</div>

              <div
                className="post-description"
                dangerouslySetInnerHTML={{ __html: descriptionText }}
              />

              {formData.blog_tips_section &&
                formData.blog_tips_section.trim() !== "" && (
                  <div className="post-bolded-text post-tips-section-container">
                    {(() => {
                      // Auto-generate tips link for preview
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

                      return (
                        <a
                          href={tipsPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="post-tips-link"
                          dangerouslySetInnerHTML={{ __html: tipsText }}
                        />
                      );
                    })()}
                  </div>
                )}

              {/* Content Sections */}
              {formData.include_content &&
                formData.content_sections &&
                formData.content_sections.length > 0 && (
                  <div className="preview-content-sections">
                    {formData.content_sections.map((section, index) => (
                      <div
                        key={section.key || index}
                        className="preview-content-section"
                      >
                        {renderContentSection(section, index)}
                      </div>
                    ))}
                  </div>
                )}

              {/* Empty state for content sections */}
              {(!formData.include_content ||
                !formData.content_sections ||
                formData.content_sections.length === 0) && (
                <div className="preview-empty-content">
                  <div className="preview-empty-icon">📝</div>
                  <div className="preview-empty-text">
                    Add content sections to see them in the preview
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }, [formData]);

  return previewContent;
};

BlogPreview.propTypes = {
  formData: PropTypes.shape({
    country: PropTypes.string,
    title: PropTypes.string,
    blog_header: PropTypes.string,
    blog_subtitle: PropTypes.string,
    blog_description_detailed: PropTypes.string,
    blog_tips_section: PropTypes.string,
    background_image: PropTypes.object,
    include_content: PropTypes.bool,
    content_sections: PropTypes.array,
    include_itineraries: PropTypes.bool,
    itineraries: PropTypes.array,
    include_maps: PropTypes.bool,
    maps: PropTypes.array,
  }).isRequired,
};

export default BlogPreview;
