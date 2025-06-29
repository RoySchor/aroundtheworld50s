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

  const getTerminalCommand = () => {
    const dataString = JSON.stringify(galleryData);
    return `python3 -m scripts.gallery_management.gallery_manager update '${dataString}'`;
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
              <strong>💡 How it works:</strong> You'll run a simple terminal script
              to apply the gallery changes - just like the blog management system.
            </p>
          </div>

                      {newImages.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Important:</strong> Make sure you have your new image
                  files saved locally before running the script.
                </p>
              </div>
            )}

          <div className="gallery-script-actions">
                          <button
                onClick={handleStartProcess}
                className="gallery-script-btn primary"
              >
                🚀 Get Gallery Script
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

                 {/* Images to Remove */}
         {removedImages.length > 0 && (
           <div className="mb-6 p-4 bg-gray-50 rounded-lg">
             <h4 className="font-semibold text-gray-800 mb-2">
               🗑️ Images to Remove
             </h4>
             <p className="text-sm text-gray-700 mb-2">
               The following images will be removed from your gallery:
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

                 {/* Run Terminal Command */}
         <div className="mb-6 p-4 bg-gray-50 rounded-lg">
           <h4 className="font-semibold text-gray-800 mb-2">
             💻 Run the Gallery Script
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
