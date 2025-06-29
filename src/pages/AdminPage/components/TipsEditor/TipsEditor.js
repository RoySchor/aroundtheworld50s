import React, { useState } from "react";
import TipsSelector from "./TipsSelector";
import TipsEditForm from "./TipsEditForm";
import TipsPreview from "./TipsPreview";
import TipsScriptRunner from "./TipsScriptRunner";
import { loadTipsContent } from "../../../../utils/tipsFileManager";
import "./TipsEditor.css";

const TipsEditor = () => {
  const [activeTab, setActiveTab] = useState("manage");
  const [selectedTip, setSelectedTip] = useState(null);
  const [tipsData, setTipsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isExistingContent, setIsExistingContent] = useState(false);

  const handleTipSelect = async (tip) => {
    setSelectedTip(tip);
    setLoading(true);

    try {
      // Try to load existing content
      const existingContent = await loadTipsContent(tip.path);

      if (existingContent && existingContent.content) {
        // Load existing content for editing
        setTipsData({
          essentialTips: existingContent.content.essentialTips || "",
          budgetPlanning: existingContent.content.budgetPlanning || "",
          foodDining: existingContent.content.foodDining || "",
          transportation: existingContent.content.transportation || "",
          accommodation: existingContent.content.accommodation || "",
          safetyHealth: existingContent.content.safetyHealth || "",
        });
        setIsExistingContent(true);
        console.log(`✅ Loaded existing content for ${tip.title}`);
      } else {
        // Initialize with empty content for new tips page
        setTipsData({
          essentialTips: "",
          budgetPlanning: "",
          foodDining: "",
          transportation: "",
          accommodation: "",
          safetyHealth: "",
        });
        setIsExistingContent(false);
        console.log(`📝 Creating new tips page for ${tip.title}`);
      }
    } catch (error) {
      // Fallback to empty content if loading fails
      setTipsData({
        essentialTips: "",
        budgetPlanning: "",
        foodDining: "",
        transportation: "",
        accommodation: "",
        safetyHealth: "",
      });
      setIsExistingContent(false);
      console.log(
        `📝 Creating new tips page for ${tip.title} (file not found)`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTipsDataChange = (section, value) => {
    setTipsData((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  return (
    <div className="tips-editor-container">
      {/* Tab Navigation */}
      <div className="admin-tab-navigation">
        <button
          className={`admin-tab ${activeTab === "manage" ? "active" : ""}`}
          onClick={() => setActiveTab("manage")}
        >
          ✏️ Edit Tips
        </button>
        <button
          className={`admin-tab ${activeTab === "preview" ? "active" : ""}`}
          onClick={() => setActiveTab("preview")}
          disabled={!selectedTip || loading}
        >
          👁️ Preview
        </button>
        <button
          className={`admin-tab ${activeTab === "deploy" ? "active" : ""}`}
          onClick={() => setActiveTab("deploy")}
          disabled={!selectedTip || loading}
        >
          🚀 Deploy
        </button>
      </div>

      {/* Tab Content */}
      <div className="admin-tab-content">
        {activeTab === "manage" ? (
          <div className="tips-edit-layout">
            <div className="tips-selector-section">
              <TipsSelector
                selectedTip={selectedTip}
                onTipSelect={handleTipSelect}
              />
            </div>

            {selectedTip && (
              <div className="tips-form-section">
                <div className="tips-form-header">
                  <div className="tips-form-title-section">
                    <h3>Editing: {selectedTip.title}</h3>
                    {!loading && (
                      <div
                        className={`tips-content-status ${isExistingContent ? "existing" : "new"}`}
                      >
                        {isExistingContent ? (
                          <span>✏️ Editing existing content</span>
                        ) : (
                          <span>📝 Creating new tips page</span>
                        )}
                      </div>
                    )}
                  </div>
                  {loading && (
                    <div className="tips-loading-indicator">
                      <span className="tips-loading-spinner"></span>
                      Loading existing content...
                    </div>
                  )}
                </div>

                {!loading && (
                  <TipsEditForm
                    tipsData={tipsData}
                    onDataChange={handleTipsDataChange}
                  />
                )}
              </div>
            )}
          </div>
        ) : activeTab === "preview" ? (
          selectedTip && <TipsPreview tip={selectedTip} tipsData={tipsData} />
        ) : (
          selectedTip && (
            <TipsScriptRunner tip={selectedTip} tipsData={tipsData} />
          )
        )}
      </div>
    </div>
  );
};

export default TipsEditor;
