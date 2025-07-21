import React, { useState, useEffect } from "react";
import BlogGeneratorForm from "./components/BlogGeneratorForm/BlogGeneratorForm";
import JsonPreview from "./components/JsonPreview/JsonPreview";
import BlogPreview from "./components/BlogPreview/BlogPreview";
import GalleryManager from "./components/GalleryManager/GalleryManager";
import TipsEditor from "./components/TipsEditor/TipsEditor";
import AdminLogin from "../../components/AdminLogin/AdminLogin";
import { useSmartDebounce } from "./hooks/useDebounce";
import "./AdminPage.css";

// Initial blog form state
const initialFormState = {
  country: "",
  country_code: "",
  state: "",
  title: "",
  blog_description: "",
  background_image: null,
  blog_header: "",
  blog_subtitle: "",
  blog_description_detailed: "",
  blog_tips_section: "",
  include_itineraries: false,
  itineraries: [{ title: "", items: [""] }],
  include_maps: false,
  maps: [{ name: "", title: "", url: "" }],
  include_content: true,
  content_sections: [],
};

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [mainTab, setMainTab] = useState("blog");
  const [activeTab, setActiveTab] = useState("preview");
  const [formData, setFormData] = useState(initialFormState);

  // Check authentication first
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = sessionStorage.getItem("adminAuthenticated");
      const authTimestamp = sessionStorage.getItem("authTimestamp");

      if (isAuth === "true" && authTimestamp) {
        const sessionAge = Date.now() - parseInt(authTimestamp);
        const maxSessionAge = 12 * 60 * 60 * 1000;

        if (sessionAge < maxSessionAge) {
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem("adminAuthenticated");
          sessionStorage.removeItem("authTimestamp");
          setIsAuthenticated(false);
        }
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, []);

  // Load saved form data after auth check is complete and user is authenticated
  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated) {
      const savedFormData = sessionStorage.getItem("blogFormData");
      if (savedFormData) {
        try {
          const parsedData = JSON.parse(savedFormData);
          // Reset file input since we can't store File objects
          parsedData.background_image = null;
          if (parsedData.content_sections) {
            parsedData.content_sections = parsedData.content_sections.map(
              (section) => {
                if (section.image) section.image = null;
                if (section.images)
                  section.images = section.images.map(() => null);
                return section;
              },
            );
          }
          setFormData(parsedData);
        } catch (error) {
          console.error("Error loading saved form data:", error);
        }
      }
    }
  }, [isCheckingAuth, isAuthenticated]);

  // Save form data when it changes and user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      try {
        // Create a copy of form data without file objects
        const formDataToSave = { ...formData };
        formDataToSave.background_image = null;
        if (formDataToSave.content_sections) {
          formDataToSave.content_sections = formDataToSave.content_sections.map(
            (section) => {
              const sectionCopy = { ...section };
              if (sectionCopy.image) sectionCopy.image = null;
              if (sectionCopy.images)
                sectionCopy.images = sectionCopy.images.map(() => null);
              return sectionCopy;
            },
          );
        }
        console.log("Saving form data to sessionStorage:", formDataToSave);
        sessionStorage.setItem("blogFormData", JSON.stringify(formDataToSave));
      } catch (error) {
        console.error("Error saving form data:", error);
      }
    }
  }, [formData, isAuthenticated]);

  const handleLogin = (authenticated) => {
    setIsAuthenticated(authenticated);
    if (authenticated) {
      sessionStorage.setItem("adminAuthenticated", "true");
      sessionStorage.setItem("authTimestamp", Date.now().toString());
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    sessionStorage.removeItem("authTimestamp");
    sessionStorage.removeItem("blogFormData");
    setFormData(initialFormState);
    setIsAuthenticated(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItineraryChange = (index, field, value) => {
    const updatedItineraries = [...formData.itineraries];
    if (field === "items") {
      updatedItineraries[index][field] = value;
    } else {
      updatedItineraries[index][field] = value;
    }
    setFormData((prev) => ({
      ...prev,
      itineraries: updatedItineraries,
    }));
  };

  const addItinerary = () => {
    setFormData((prev) => ({
      ...prev,
      itineraries: [...prev.itineraries, { title: "", items: [""] }],
    }));
  };

  const removeItinerary = (index) => {
    if (formData.itineraries.length > 1) {
      const updatedItineraries = formData.itineraries.filter(
        (_, i) => i !== index,
      );
      setFormData((prev) => ({
        ...prev,
        itineraries: updatedItineraries,
      }));
    }
  };

  const addItineraryItem = (itineraryIndex) => {
    const updatedItineraries = [...formData.itineraries];
    updatedItineraries[itineraryIndex].items.push("");
    setFormData((prev) => ({
      ...prev,
      itineraries: updatedItineraries,
    }));
  };

  const removeItineraryItem = (itineraryIndex, itemIndex) => {
    const updatedItineraries = [...formData.itineraries];
    if (updatedItineraries[itineraryIndex].items.length > 1) {
      updatedItineraries[itineraryIndex].items.splice(itemIndex, 1);
      setFormData((prev) => ({
        ...prev,
        itineraries: updatedItineraries,
      }));
    }
  };

  const handleMapChange = (index, field, value) => {
    const updatedMaps = [...formData.maps];
    // Remove spaces from map name to ensure valid JSON structure
    if (field === "name") {
      updatedMaps[index][field] = value.replace(/\s+/g, "");
    } else {
      updatedMaps[index][field] = value;
    }
    setFormData((prev) => ({
      ...prev,
      maps: updatedMaps,
    }));
  };

  const addMap = () => {
    setFormData((prev) => ({
      ...prev,
      maps: [...prev.maps, { name: "", title: "", url: "" }],
    }));
  };

  const removeMap = (index) => {
    if (formData.maps.length > 1) {
      const updatedMaps = formData.maps.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        maps: updatedMaps,
      }));
    }
  };

  const handleContentChange = (index, field, value) => {
    const updatedContent = [...formData.content_sections];

    if (field.includes(".")) {
      const [parentField, childField] = field.split(".");
      updatedContent[index][parentField][childField] = value;
    } else {
      updatedContent[index][field] = value;
    }

    setFormData((prev) => ({
      ...prev,
      content_sections: updatedContent,
    }));
  };

  const addContentSection = (type) => {
    const newSection = {
      key: `${type}Section${formData.content_sections.length + 1}`,
      layout: {
        type: type,
        ...(type === "two-column" && {
          left_type: "image",
          right_type: "text",
          image_alt: "",
          leftType: "image",
          rightType: "text",
        }),
        ...(type === "itinerary-with-map" && {
          map_index: 0,
        }),
      },
      content:
        type === "image-grid" ||
        type === "itinerary-with-map" ||
        type === "instagram"
          ? null
          : "",
      ...(type === "two-column" && { image: null }),
      ...(type === "image-grid" && { images: [null] }),
    };

    setFormData((prev) => ({
      ...prev,
      content_sections: [...prev.content_sections, newSection],
    }));
  };

  const removeContentSection = (index) => {
    const updatedContent = formData.content_sections.filter(
      (_, i) => i !== index,
    );
    setFormData((prev) => ({
      ...prev,
      content_sections: updatedContent,
    }));
  };

  const handleMoveContentSection = (fromIndex, direction) => {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;

    if (toIndex < 0 || toIndex >= formData.content_sections.length) {
      return;
    }

    const newContentSections = [...formData.content_sections];
    const [movedSection] = newContentSections.splice(fromIndex, 1);
    newContentSections.splice(toIndex, 0, movedSection);

    setFormData({
      ...formData,
      content_sections: newContentSections,
    });
  };

  const handleClearForm = () => {
    if (
      window.confirm(
        "Are you sure you want to clear the form? This will remove all entered data.",
      )
    ) {
      setFormData(initialFormState);
      sessionStorage.removeItem("blogFormData");
    }
  };

  // Get debounced form data for preview
  const debouncedFormData = useSmartDebounce(formData);

  if (isCheckingAuth) {
    return (
      <div className="page-container admin">
        <div className="admin-loading">
          <div className="admin-loading-spinner"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="page-container admin">
      <div className="admin-page-header">
        <div className="admin-header-content">
          <div>
            <h1 className="admin-page-title">Content Management</h1>
            <p className="admin-page-subtitle">
              Manage blog posts, gallery images, and travel tips
            </p>
          </div>
          <div className="admin-header-actions">
            <button
              onClick={handleClearForm}
              className="admin-clear-btn"
              title="Clear form"
            >
              🗑️ Clear Form
            </button>
            <button
              onClick={handleLogout}
              className="admin-logout-btn"
              title="Logout"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="admin-main-tab-navigation">
        <button
          className={`admin-main-tab ${mainTab === "blog" ? "active" : ""}`}
          onClick={() => setMainTab("blog")}
        >
          📝 Blog Generator
        </button>
        <button
          className={`admin-main-tab ${mainTab === "gallery" ? "active" : ""}`}
          onClick={() => setMainTab("gallery")}
        >
          🖼️ Gallery Manager
        </button>
        <button
          className={`admin-main-tab ${mainTab === "tips" ? "active" : ""}`}
          onClick={() => setMainTab("tips")}
        >
          💡 Tips Editor
        </button>
      </div>

      {/* Tab Content */}
      {mainTab === "blog" ? (
        <div className="admin-two-column-layout">
          <div className="admin-column admin-left-column">
            <BlogGeneratorForm
              formData={formData}
              onInputChange={handleInputChange}
              onItineraryChange={handleItineraryChange}
              onAddItinerary={addItinerary}
              onRemoveItinerary={removeItinerary}
              onAddItineraryItem={addItineraryItem}
              onRemoveItineraryItem={removeItineraryItem}
              onMapChange={handleMapChange}
              onAddMap={addMap}
              onRemoveMap={removeMap}
              onContentChange={handleContentChange}
              onAddContentSection={addContentSection}
              onRemoveContentSection={removeContentSection}
              onMoveContentSection={handleMoveContentSection}
            />
          </div>

          <div className="admin-column admin-right-column">
            {/* Blog Tab Navigation */}
            <div className="admin-tab-navigation">
              <button
                className={`admin-tab ${activeTab === "preview" ? "active" : ""}`}
                onClick={() => setActiveTab("preview")}
              >
                🎨 Preview
              </button>
              <button
                className={`admin-tab ${activeTab === "json" ? "active" : ""}`}
                onClick={() => setActiveTab("json")}
              >
                📄 JSON
              </button>
            </div>

            {/* Blog Tab Content */}
            <div className="admin-tab-content">
              {activeTab === "preview" ? (
                <BlogPreview formData={debouncedFormData} />
              ) : (
                <JsonPreview formData={formData} />
              )}
            </div>
          </div>
        </div>
      ) : mainTab === "gallery" ? (
        <GalleryManager />
      ) : (
        <TipsEditor />
      )}
    </div>
  );
};

export default AdminPage;
