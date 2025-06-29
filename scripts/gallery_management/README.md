# Gallery Management System

> **Python-based system for managing home page rotating gallery images**

This system provides both command-line and web-based interfaces for managing the rotating gallery on your home page. It follows the same pattern as the blog management system with automatic deployment workflows.

## 🚀 Features

- **Add/Remove Images** - Manage gallery images through web interface or CLI
- **Live Preview** - See gallery changes in real-time with rotating simulator
- **Automatic Deployment** - Dev server → User approval → Git commit → Production deploy
- **Error Recovery** - Automatic rollback if deployment fails
- **Image Optimization** - Handles supported formats (JPG, PNG, WebP, GIF)

## 🖥️ Usage Options

### 1. Web Interface (Recommended)
- Navigate to `/admin` → Gallery Manager tab
- Upload images, preview changes, and deploy

### 2. Command Line
```bash
# List current images
python3 scripts/gallery_management/gallery_manager.py list

# Add images
python3 scripts/gallery_management/gallery_manager.py add path/to/image1.jpg path/to/image2.png

# Remove images
python3 scripts/gallery_management/gallery_manager.py remove IMG_1508.jpeg IMG_1628.jpeg

# Update with JSON
python3 scripts/gallery_management/gallery_manager.py update '{"add_images": ["new1.jpg"], "remove_images": ["old1.jpg"]}'
```

## 📁 File Structure

**Gallery Location:** `src/assets/homePageGallery/`

**Supported Formats:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

## 🔄 Deployment Workflow

1. **Manage** - Add/remove images through interface
2. **Preview** - Review changes in rotating gallery simulator
3. **Deploy** - Run script that:
   - Updates gallery files
   - Runs `npm run lint:fix`
   - Starts dev server for testing
   - Awaits user approval
   - Commits, pushes, and deploys changes

## 🛠️ Technical Implementation

- **Frontend:** React components with tabbed interface
- **Backend:** Python script with file operations
- **Process:** Same pattern as blog management system
- **Integration:** Seamlessly integrated into existing admin panel

---

**Part of the Content Management System** | **Consistent with blog management workflows**