# Tips Management System

Complete automation system for managing travel tips content, following established patterns from the blog management system.

## Features

- 🎯 **Full Automation**: Download, validate, lint, deploy in one command
- 🔄 **Automatic Backup**: Creates backup commits before making changes
- ✅ **User Approval**: Shows preview and requires confirmation before deploying
- 🔍 **Linting**: Runs ESLint fix automatically
- 📤 **Git Integration**: Commits and pushes changes automatically
- 🛡️ **Error Recovery**: Automatic rollback if anything goes wrong

## How It Works

### 1. Edit Tips in Admin Panel
- Go to Admin → Tips Editor
- Select a destination
- Edit the content sections
- Click "Save Changes" → "Deploy"

### 2. Download & Deploy
- Click "Download & Generate Command"
- Copy the terminal command
- Run it in your terminal

### 3. Automated Workflow
The script handles everything:
```
🚀 Validate content
💾 Save to project files
🔍 Run ESLint fix
👀 Show preview
🤔 Ask for approval
📤 Commit & push
✅ Deploy live
```

## Script Usage

```bash
python3 scripts/tips_management/tips_manager.py <tips_json_file>
```

### Example
```bash
cd /Users/rschor/Desktop/my-projects/around-the-world-50s
python3 scripts/tips_management/tips_manager.py ~/Downloads/trinidad-and-tobago-tips.json
```

## File Structure

```
scripts/tips_management/
├── tips_manager.py      # Main tips management script
└── README.md           # This documentation

src/data/tipsContent/   # Generated tips content files
├── trinidad-and-tobago.json
└── [other-locations].json
```

## Content Format

Tips are saved as JSON files with this structure:

```json
{
  "tip": {
    "id": 1,
    "title": "Trinidad & Tobago",
    "country": "Trinidad and Tobago",
    "country_code": "TT",
    "state": null,
    "path": "trinidad-and-tobago",
    "created_at": "2024-01-20T10:00:00Z",
    "updated_at": "2024-01-20T15:30:00Z"
  },
  "content": {
    "essentialTips": "<p>HTML content...</p>",
    "budgetPlanning": "<p>HTML content...</p>",
    "foodDining": "<p>HTML content...</p>",
    "transportation": "<p>HTML content...</p>",
    "accommodation": "<p>HTML content...</p>",
    "safetyHealth": "<p>HTML content...</p>"
  },
  "lastModified": "2024-01-20T15:30:00Z"
}
```

## Dependencies

- Python 3.x
- Existing blog management modules:
  - `process_management.py`
  - `file_operations.py`
- Node.js and npm (for linting)
- Git (for version control)

## Error Handling

The script includes comprehensive error handling:
- ✅ Validates content before processing
- 🔄 Creates backup commits for safe rollback
- 🛡️ Automatic rollback if any step fails
- 📋 Detailed error messages and logging

## Integration

Tips content automatically loads on the website:
- No server restart required
- Content loads from JSON files dynamically
- Immediate availability after deployment