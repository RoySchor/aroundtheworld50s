import React, { useState } from "react";
import TipsSelector from "./TipsSelector";
import TipsEditForm from "./TipsEditForm";
import TipsPreview from "./TipsPreview";
import TipsScriptRunner from "./TipsScriptRunner";
import { loadTipsContent } from "../../../../utils/tipsFileManager";
import "./TipsEditor.css";

// Helper function to convert HTML to markdown
const convertHtmlToMarkdown = (html) => {
  if (!html) return "";

  let markdown = html;

  // Convert paragraph tags
  markdown = markdown.replace(/<p>(.*?)<\/p>/g, "$1\n\n");

  // Convert unordered lists
  markdown = markdown.replace(/<ul>(.*?)<\/ul>/g, (match, content) => {
    // Split content by list items and process each
    const items = content.split("</li>").filter((item) => item.trim());
    return items
      .map((item) => {
        // Remove <li> tag and convert to bullet point
        return "•" + item.replace(/<li>/g, "") + "•\n";
      })
      .join("");
  });

  // Convert strong tags
  markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, "**$1**");

  // Convert em tags
  markdown = markdown.replace(/<em>(.*?)<\/em>/g, "*$1*");

  // Clean up extra newlines
  markdown = markdown.replace(/\n{3,}/g, "\n\n").trim();

  return markdown;
};

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
        // Convert HTML content to markdown for editing
        const convertedContent = {};
        Object.keys(existingContent.content).forEach((section) => {
          const htmlContent = existingContent.content[section];
          convertedContent[section] = {
            content: convertHtmlToMarkdown(htmlContent),
            enabled: !!(
              htmlContent || existingContent.sectionConfig?.[section]
            ),
          };
        });

        // Load converted content for editing
        setTipsData({
          essentialTips: convertedContent.essentialTips || {
            content: "",
            enabled: true,
          },
          budgetPlanning: convertedContent.budgetPlanning || {
            content: "",
            enabled: true,
          },
          foodDining: convertedContent.foodDining || {
            content: "",
            enabled: true,
          },
          transportation: convertedContent.transportation || {
            content: "",
            enabled: true,
          },
          accommodation: convertedContent.accommodation || {
            content: "",
            enabled: false,
          },
          safetyHealth: convertedContent.safetyHealth || {
            content: "",
            enabled: false,
          },
        });
        setIsExistingContent(true);
        console.log(`✅ Loaded existing content for ${tip.title}`);
      } else {
        // Initialize with default enabled sections for new tips page
        setTipsData({
          essentialTips: { content: "", enabled: true },
          budgetPlanning: { content: "", enabled: true },
          foodDining: { content: "", enabled: true },
          transportation: { content: "", enabled: true },
          accommodation: { content: "", enabled: false },
          safetyHealth: { content: "", enabled: false },
        });
        setIsExistingContent(false);
        console.log(`📝 Creating new tips page for ${tip.title}`);
      }
    } catch (error) {
      // Fallback to default enabled sections if loading fails
      setTipsData({
        essentialTips: { content: "", enabled: true },
        budgetPlanning: { content: "", enabled: true },
        foodDining: { content: "", enabled: true },
        transportation: { content: "", enabled: true },
        accommodation: { content: "", enabled: false },
        safetyHealth: { content: "", enabled: false },
      });
      setIsExistingContent(false);
      console.log(
        `📝 Creating new tips page for ${tip.title} (file not found)`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTipsDataChange = (section, field, value) => {
    setTipsData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
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
