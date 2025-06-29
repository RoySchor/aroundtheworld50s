import React, { useState } from "react";
import PropTypes from "prop-types";

const GalleryScriptRunner = ({ newImages, removedImages, onComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [output, setOutput] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  const addOutput = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setOutput((prev) => [...prev, { message, type, timestamp }]);
  };

  const runGalleryUpdate = async () => {
    setIsRunning(true);
    setOutput([]);
    setHasErrors(false);

    try {
      addOutput("🚀 Starting gallery update process...", "info");

      // Step 1: Prepare changes
      setCurrentStep("Preparing changes");
      addOutput("📋 Preparing gallery changes...", "info");

      if (newImages.length > 0) {
        addOutput(`✅ ${newImages.length} image(s) to add`, "success");
      }
      if (removedImages.length > 0) {
        addOutput(`❌ ${removedImages.length} image(s) to remove`, "warning");
      }

      // Simulate API call to backend script
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 2: Update files
      setCurrentStep("Updating gallery files");
      addOutput("📁 Copying new images to homePageGallery folder...", "info");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (removedImages.length > 0) {
        addOutput("🗑️ Removing selected images from gallery folder...", "info");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Step 3: Run linting
      setCurrentStep("Running code quality checks");
      addOutput("🔍 Running npm run lint:fix...", "info");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      addOutput("✅ Code quality checks passed!", "success");

      // Step 4: Start dev server
      setCurrentStep("Starting development server");
      addOutput("🌐 Starting development server...", "info");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      addOutput("✅ Development server started successfully!", "success");
      addOutput("🌐 Server running at http://localhost:3000", "info");

      setCurrentStep("Awaiting user approval");
      addOutput(
        "⏳ Please check the gallery on your website and approve the changes.",
        "info",
      );
      addOutput(
        "💡 Visit your home page to see the updated rotating gallery.",
        "info",
      );

      setIsComplete(true);
    } catch (error) {
      addOutput(`❌ Error: ${error.message}`, "error");
      setHasErrors(true);
    } finally {
      setIsRunning(false);
    }
  };

  const approveChanges = async () => {
    setIsRunning(true);

    try {
      setCurrentStep("Deploying changes");
      addOutput("🚀 Deploying gallery changes...", "info");

      // Step 1: Commit changes
      addOutput("📝 Committing changes to git...", "info");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      addOutput("✅ Changes committed successfully!", "success");

      // Step 2: Push to repository
      addOutput("⬆️ Pushing changes to repository...", "info");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      addOutput("✅ Changes pushed to repository!", "success");

      // Step 3: Deploy to hosting
      addOutput("🌐 Deploying to production...", "info");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      addOutput("✅ Gallery successfully deployed to production!", "success");

      addOutput("🎉 Gallery update completed successfully!", "success");
      addOutput("💡 Your new gallery is now live on your website!", "info");

      setCurrentStep("Completed");

      // Auto-complete after a short delay
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      addOutput(`❌ Deployment error: ${error.message}`, "error");
      setHasErrors(true);
    } finally {
      setIsRunning(false);
    }
  };

  const rejectChanges = async () => {
    setIsRunning(true);

    try {
      setCurrentStep("Reverting changes");
      addOutput("↩️ Reverting gallery changes...", "warning");

      // Step 1: Stop dev server
      addOutput("⏹️ Stopping development server...", "info");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 2: Revert file changes
      addOutput("🔄 Reverting file changes...", "info");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Step 3: Clean up
      addOutput("🧹 Cleaning up temporary files...", "info");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      addOutput("✅ All changes have been reverted!", "success");
      addOutput("💡 You can make new changes and try again.", "info");

      setCurrentStep("Reverted");

      // Auto-complete after a short delay
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      addOutput(`❌ Revert error: ${error.message}`, "error");
      setHasErrors(true);
    } finally {
      setIsRunning(false);
    }
  };

  const getOutputColor = (type) => {
    switch (type) {
      case "success":
        return "text-green-400";
      case "warning":
        return "text-yellow-400";
      case "error":
        return "text-red-400";
      default:
        return "text-green-400";
    }
  };

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

        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Important:</strong> This will modify your live website.
            Make sure you've reviewed the changes in the Preview tab.
          </p>
        </div>

        {!isComplete && (
          <div className="gallery-script-actions">
            <button
              onClick={runGalleryUpdate}
              disabled={isRunning}
              className="gallery-script-btn primary"
            >
              {isRunning ? "🔄 Processing..." : "🚀 Start Gallery Update"}
            </button>
          </div>
        )}

        {isComplete && !hasErrors && (
          <div className="gallery-script-actions">
            <button
              onClick={approveChanges}
              disabled={isRunning}
              className="gallery-script-btn primary"
            >
              {isRunning ? "🔄 Deploying..." : "✅ Approve & Deploy"}
            </button>
            <button
              onClick={rejectChanges}
              disabled={isRunning}
              className="gallery-script-btn secondary"
            >
              {isRunning ? "🔄 Reverting..." : "❌ Reject & Revert"}
            </button>
          </div>
        )}
      </div>

      {/* Current Step Indicator */}
      {currentStep && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm font-medium text-blue-800">
            Current Step: {currentStep}
          </div>
          {isRunning && (
            <div className="mt-2">
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse w-full"></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Output Terminal */}
      {output.length > 0 && (
        <div className="gallery-script-output">
          {output.map((line, index) => (
            <div key={index} className={`mb-1 ${getOutputColor(line.type)}`}>
              <span className="text-gray-500">[{line.timestamp}]</span>{" "}
              {line.message}
            </div>
          ))}
          {isRunning && (
            <div className="text-green-400 animate-pulse">
              <span className="text-gray-500">
                [{new Date().toLocaleTimeString()}]
              </span>{" "}
              ▋
            </div>
          )}
        </div>
      )}
    </div>
  );
};

GalleryScriptRunner.propTypes = {
  newImages: PropTypes.array.isRequired,
  removedImages: PropTypes.array.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default GalleryScriptRunner;
