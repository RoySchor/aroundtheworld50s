/**
 * Tips File Manager - Handles saving and loading tips content
 * Follows the same patterns as the blog management system
 */

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
    return content;
  } catch (error) {
    // File doesn't exist yet, return null
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
      essentialTips: {
        content: tipsContent.essentialTips?.content || "",
        enabled: tipsContent.essentialTips?.enabled !== false,
      },
      budgetPlanning: {
        content: tipsContent.budgetPlanning?.content || "",
        enabled: tipsContent.budgetPlanning?.enabled !== false,
      },
      foodDining: {
        content: tipsContent.foodDining?.content || "",
        enabled: tipsContent.foodDining?.enabled !== false,
      },
      transportation: {
        content: tipsContent.transportation?.content || "",
        enabled: tipsContent.transportation?.enabled !== false,
      },
      accommodation: {
        content: tipsContent.accommodation?.content || "",
        enabled: tipsContent.accommodation?.enabled !== false,
      },
      safetyHealth: {
        content: tipsContent.safetyHealth?.content || "",
        enabled: tipsContent.safetyHealth?.enabled !== false,
      },
    },
    lastModified: new Date().toISOString(),
  };
};
