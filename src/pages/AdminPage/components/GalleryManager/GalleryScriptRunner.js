import React, { useState } from "react";
import PropTypes from "prop-types";

const GalleryScriptRunner = ({ newImages, removedImages, onComplete }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  // Generate the gallery changes data for the Python script
  const generateGalleryData = () => {
    return {
      add_images: newImages.map((img) => img.name),
      remove_images: removedImages.map((img) => img.name),
      new_image_files: newImages.map((img) => ({
        name: img.name,
        // Note: User will need to have these files accessible to the script
      })),
    };
  };

  const galleryData = generateGalleryData();
  const galleryDataJson = JSON.stringify(galleryData, null, 2);

  const getTerminalCommand = () => {
    const dataString = JSON.stringify(galleryData);
    return `python3 -m scripts.gallery_management.gallery_manager update '${dataString}'`;
  };

  const downloadGalleryData = () => {
    const blob = new Blob([galleryDataJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gallery_changes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(getTerminalCommand());
      alert("Command copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy command:", err);
    }
  };

  const handleStartProcess = () => {
    setShowInstructions(true);
  };

  const handleComplete = () => {
    onComplete();
  };

  if (!showInstructions) {
    return (
      <div className="gallery-script-container">
        <div className="gallery-script-summary">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🚀 Deploy Gallery Changes
          </h3>

          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">
              Changes to be applied:
            </h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {newImages.length > 0 && (
                <li>
                  ✅ Add {newImages.length} new image
                  {newImages.length !== 1 ? "s" : ""}
                </li>
              )}
              {removedImages.length > 0 && (
                <li>
                  ❌ Remove {removedImages.length} image
                  {removedImages.length !== 1 ? "s" : ""}
                </li>
              )}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
            <p className="text-sm text-blue-800">
              <strong>💡 How it works:</strong> This will prepare the gallery
              update configuration. You'll then run a terminal script to apply
              the changes - just like the blog management system.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Important:</strong> Make sure you have your new image
              files saved locally before running the script.
            </p>
          </div>

          <div className="gallery-script-actions">
            <button
              onClick={handleStartProcess}
              className="gallery-script-btn primary"
            >
              🚀 Prepare Gallery Script
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-script-container">
      <div className="gallery-script-summary">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          📋 Gallery Update Instructions
        </h3>

        {/* Step 1: Prepare Images */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">
            📁 Step 1: Prepare Your Images
          </h4>
          {newImages.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-gray-700 mb-2">
                <strong>New images to add:</strong> Make sure these files are
                saved to your Desktop or a known location:
              </p>
              <ul className="text-xs bg-white p-2 rounded border space-y-1">
                {newImages.map((img, index) => (
                  <li key={index} className="font-mono text-green-600">
                    📄 {img.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {removedImages.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Images to remove:</strong>
              </p>
              <ul className="text-xs bg-white p-2 rounded border space-y-1">
                {removedImages.map((img, index) => (
                  <li key={index} className="font-mono text-red-600">
                    🗑️ {img.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Step 2: Run Terminal Command */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">
            💻 Step 2: Run the Gallery Script
          </h4>
          <p className="text-sm text-gray-700 mb-3">
            Copy and run this command in your terminal from your project root:
          </p>

          <div className="bg-black text-green-400 p-3 rounded font-mono text-xs mb-3 relative">
            <code className="break-all">{getTerminalCommand()}</code>
            <button
              onClick={copyCommand}
              className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
              title="Copy command"
            >
              📋 Copy
            </button>
          </div>

          <div className="text-xs text-gray-600 space-y-1">
            <p>
              • Make sure you're in your project directory:{" "}
              <code className="bg-gray-200 px-1 rounded">
                cd /path/to/around-the-world-50s
              </code>
            </p>
            <p>
              • The script will handle file copying, linting, dev server, and
              deployment
            </p>
            <p>
              • You'll be prompted to approve or reject the changes after
              reviewing
            </p>
          </div>
        </div>

        {/* Step 3: Alternative Method */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">
            🔧 Alternative: Manual Commands
          </h4>
          <p className="text-sm text-gray-700 mb-2">
            Or run individual commands:
          </p>
          <div className="space-y-2 text-xs">
            <div className="bg-black text-green-400 p-2 rounded font-mono">
              # List current images
              <br />
              python3 -m scripts.gallery_management.gallery_manager list
            </div>
            {newImages.length > 0 && (
              <div className="bg-black text-green-400 p-2 rounded font-mono">
                # Add new images (update paths as needed)
                <br />
                python3 -m scripts.gallery_management.gallery_manager add{" "}
                {newImages.map((img) => `~/Desktop/${img.name}`).join(" ")}
              </div>
            )}
            {removedImages.length > 0 && (
              <div className="bg-black text-green-400 p-2 rounded font-mono">
                # Remove images
                <br />
                python3 -m scripts.gallery_management.gallery_manager remove{" "}
                {removedImages.map((img) => img.name).join(" ")}
              </div>
            )}
          </div>
        </div>

        {/* Configuration Data */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">
            📄 Configuration Data
          </h4>
          <p className="text-sm text-gray-700 mb-2">
            Gallery update configuration:
          </p>
          <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
            {galleryDataJson}
          </pre>
          <button
            onClick={downloadGalleryData}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
          >
            💾 Download JSON
          </button>
        </div>

        {/* Actions */}
        <div className="gallery-script-actions">
          <button
            onClick={handleComplete}
            className="gallery-script-btn primary"
          >
            ✅ Done - Return to Manager
          </button>
        </div>
      </div>
    </div>
  );
};

GalleryScriptRunner.propTypes = {
  newImages: PropTypes.array.isRequired,
  removedImages: PropTypes.array.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default GalleryScriptRunner;
