import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  formatTipsForSaving,
  downloadTipsFile,
} from "../../../../utils/tipsFileManager";

const TipsScriptRunner = ({ tip, tipsData }) => {
  const [terminalCommand, setTerminalCommand] = useState("");

  const handleDownloadAndGenerate = () => {
    const formattedData = formatTipsForSaving(tip, tipsData);
    downloadTipsFile(formattedData, tip.path);

    const filename = `${tip.path}-tips.json`;

    // Use just the filename - the script will search for it automatically
    const command = `cd /Users/rschor/Desktop/my-projects/around-the-world-50s && python3 scripts/tips_management/tips_manager.py "${filename}"`;

    setTerminalCommand(command);
  };

  return (
    <div className="blog-script-runner">
      <div className="blog-script-header">
        <h2>🚀 Deploy Tips Content</h2>
        <p>
          Save your tips content for <strong>{tip.title}</strong> with our
          automated deployment system.
        </p>
      </div>

      <div className="blog-script-content">
        <div className="blog-script-section">
          <h3>📁 Step 1: Download Tips Data</h3>
          <p>
            Click the button below to download your tips content. The file will
            be saved to your Downloads folder, and the deployment script will
            automatically find it:
          </p>

          <button
            className="blog-download-btn"
            onClick={handleDownloadAndGenerate}
          >
            💾 Download & Generate Command
          </button>
        </div>

        {terminalCommand && (
          <div className="blog-script-section">
            <h3>⌨️ Step 2: Run Deployment Command</h3>
            <p>
              Copy and run this command in your terminal. The script will
              automatically search for your JSON file in common locations:
            </p>

            <div className="blog-terminal-command">
              <pre>{terminalCommand}</pre>
              <button
                className="blog-copy-btn"
                onClick={() => navigator.clipboard.writeText(terminalCommand)}
              >
                📋 Copy
              </button>
            </div>

            <div className="blog-script-info">
              <h4>🤖 What this command does:</h4>
              <ul>
                <li>💾 Saves the content to your project</li>
                <li>🔧 Runs ESLint to fix any formatting issues</li>
                <li>👀 Shows you a preview of the content</li>
                <li>🤔 Asks for your approval before deploying</li>
                <li>📤 Commits and pushes changes to GitHub</li>
                <li>
                  🚀 Makes your tips content<strong>live</strong>immediately
                </li>
              </ul>
            </div>

            <div className="blog-script-success">
              <h4>✅ After running the command:</h4>
              <ul>
                <li>
                  Your tips content will be live at:{" "}
                  <code>/tips/{tip.path}</code>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

TipsScriptRunner.propTypes = {
  tip: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    state: PropTypes.string,
    path: PropTypes.string.isRequired,
  }).isRequired,
  tipsData: PropTypes.shape({
    essentialTips: PropTypes.shape({
      content: PropTypes.string,
      enabled: PropTypes.bool,
    }),
    budgetPlanning: PropTypes.shape({
      content: PropTypes.string,
      enabled: PropTypes.bool,
    }),
    foodDining: PropTypes.shape({
      content: PropTypes.string,
      enabled: PropTypes.bool,
    }),
    transportation: PropTypes.shape({
      content: PropTypes.string,
      enabled: PropTypes.bool,
    }),
    accommodation: PropTypes.shape({
      content: PropTypes.string,
      enabled: PropTypes.bool,
    }),
    safetyHealth: PropTypes.shape({
      content: PropTypes.string,
      enabled: PropTypes.bool,
    }),
  }).isRequired,
};

export default TipsScriptRunner;
