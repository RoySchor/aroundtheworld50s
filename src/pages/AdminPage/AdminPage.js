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
    include_itineraries: false,
    itineraries: [{ title: "", items: [""] }],
    include_maps: false,
    maps: [{ name: "", title: "", url: "" }],
    include_content: false,
    content_sections: [],
  });

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
    updatedMaps[index][field] = value;
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
        }),
      },
      content: "",
      ...(type === "two-column" && { image: null }),
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
