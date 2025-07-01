# Gallery Management System

> **Modern web interface and automated script for managing the home page gallery**

This system provides an intuitive web interface and automated script for managing the rotating gallery on your home page, making it easy for non-technical users to update their gallery while maintaining code quality and deployment safety.

## 🎨 Web Interface Features

- **Visual Gallery Management** - Drag and drop interface for image management
- **Live Preview** - See exactly how your changes will look
- **Automatic Image Processing** - Handles image optimization and formatting
- **Intuitive Controls** - Add, remove, and reorder images with ease
- **Real-time Validation** - Instant feedback on image compatibility
- **One-Click Command Copy** - Auto-generates the necessary command to run

## 🤖 Automation Features

- **One-Click Execution** - Run changes directly from the web interface
- **Smart File Operations** - Automatic image copying and cleanup
- **Quality Assurance** - Automatic code formatting and linting
- **Preview Environment** - Development server for change verification
- **Automated Deployment** - Handles git operations and production updates

## 🖥️ How to Update Your Gallery

1. **Access the Interface**
   - Navigate to `/admin` and log in
   - Select the Gallery Manager tab

2. **Make Your Changes**
   - Drag and drop images to add/remove
   - Preview your changes in real-time
   - Rearrange images as needed

3. **Execute Changes**
   - Click "Generate Command" to get your custom command
   - Copy the command (it's automatically copied to your clipboard)
   - Paste and run in your terminal
   - The system handles everything else automatically!

Example of an auto-generated command:
```bash
python3 -m scripts.gallery_management.gallery_manager update '{"add_images": ["vacation1.jpg", "beach2.jpg"], "remove_images": ["old1.jpg"]}'
```

## 📋 Automated Workflow

1. **Upload** - Add images through drag-and-drop interface
2. **Preview** - See live preview of gallery changes
3. **Validate** - Automatic image format and size validation
4. **Execute** - One-click to apply changes
5. **Review** - Automatic preview in development environment
6. **Deploy** - Automated git operations and deployment

## 🔍 Smart File Management

The system handles files intelligently:
- **Automatic Discovery** - Finds images in common locations
- **Format Support** - Handles `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
- **Size Optimization** - Automatic image resizing and compression
- **Name Conflict Resolution** - Smart file naming system

## 🔄 Deployment Process

The automated deployment process includes:

1. **Validation** - Check image formats and sizes
2. **Processing** - Optimize and prepare images
3. **Integration** - Update necessary code files
4. **Quality Check** - Run linting and formatting
5. **Preview** - Launch development environment
6. **Deployment** - Handle git operations and production update

## 🛡️ Safety Features

- **Automatic Rollback** - One-click revert if needed
- **Format Validation** - Ensures image compatibility
- **Backup System** - Preserves original files
- **Error Prevention** - Validates changes before deployment
- **Process Management** - Handles server and resource cleanup

## 👩‍💻 Developer Commands

*Note: These commands are for development purposes only. Regular users should use the web interface.*

```bash
# List current images
python3 -m scripts.gallery_management.gallery_manager list

# Add images (provide full paths)
python3 -m scripts.gallery_management.gallery_manager add ~/Desktop/image1.jpg ~/Desktop/image2.png

# Remove images (provide filenames)
python3 -m scripts.gallery_management.gallery_manager remove IMG_1508.jpeg IMG_1628.jpeg
```

---

**Modern Web Interface** | **Automated Workflow** | **Non-Technical User Friendly**