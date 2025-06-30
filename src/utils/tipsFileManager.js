/**
 * Tips File Manager - Handles saving and loading tips content
 * Follows the same patterns as the blog management system
 */

const convertHtmlToMarkdown = (htmlContent) => {
  if (!htmlContent) return "";

  let content = htmlContent;

  // Convert <br> tags to newlines
  content = content.replace(/<br\s*\/?>/g, "\n");

  // Handle lists
  const listRegex = /<ul>(.*?)<\/ul>/gs;
  content = content.replace(listRegex, (match, listContent) => {
    // Convert each list item to bullet point format
    const items = listContent.match(/<li>(.*?)<\/li>/gs) || [];
    const markdownItems = items.map((item) => {
      const itemContent = item.replace(/<li>(.*?)<\/li>/s, "$1");
      return `•${itemContent}•`;
    });
    return markdownItems.join("\n") + "\n";
  });

  // Convert <strong> tags to **text**
  content = content.replace(/<strong>(.*?)<\/strong>/g, "**$1**");

  // Convert <em> tags to *text*
  content = content.replace(/<em>(.*?)<\/em>/g, "*$1*");

  // Remove <p> tags but keep their content
  content = content.replace(/<p>(.*?)<\/p>/g, "$1\n");

  // Clean up any extra newlines
  content = content.replace(/\n{3,}/g, "\n\n");
  content = content.trim();

  return content;
};

export const downloadTipsFile = (tipsData, tipPath) => {
  const dataStr = JSON.stringify(tipsData, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportFileDefaultName = `${tipPath}-tips.json`;

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
};

// Generate file instructions for the tips management
export const generateTipsInstructions = (tipData, tipsContent) => {
  const fileName = `${tipData.path}.json`;
  const filePath = `src/data/tipsContent/${fileName}`;

  return {
    fileName,
    filePath,
    instructions: [
      `1. Save the downloaded JSON file as: ${fileName}`,
      `2. Place it in your project at: ${filePath}`,
      `3. The tips content will automatically load on the next page refresh`,
    ],
    terminalCommand: `# Optional: You can also create the file manually
mkdir -p src/data/tipsContent
# Then copy your downloaded JSON file to the tipsContent directory`,
  };
};

export const loadTipsContent = async (tipPath) => {
  try {
    // Try to import the tips content file
    const tipsModule = await import(`../data/tipsContent/${tipPath}.json`);
    const content = tipsModule.default || tipsModule;

    // If content exists, convert HTML to markdown in each section
    if (content && content.content) {
      Object.keys(content.content).forEach((section) => {
        if (content.content[section]) {
          // Convert HTML content to markdown
          const markdownContent = convertHtmlToMarkdown(
            content.content[section],
          );
          // Update the section with markdown content
          content.content[section] = markdownContent;
        }
      });
    }

    return content;
  } catch (error) {
    // File doesn't exist yet, return null
    console.log(`Tips content not found for ${tipPath}, using placeholders`);
    return null;
  }
};

export const formatTipsForSaving = (tipData, tipsContent) => {
  return {
    tip: {
      id: tipData.id,
      title: tipData.title,
      country: tipData.country,
      country_code: tipData.country_code,
      state: tipData.state,
      path: tipData.path,
      created_at: tipData.created_at,
      updated_at: new Date().toISOString(),
    },
    content: {
      essentialTips: tipsContent.essentialTips || "",
      budgetPlanning: tipsContent.budgetPlanning || "",
      foodDining: tipsContent.foodDining || "",
      transportation: tipsContent.transportation || "",
      accommodation: tipsContent.accommodation || "",
      safetyHealth: tipsContent.safetyHealth || "",
    },
    lastModified: new Date().toISOString(),
  };
};
