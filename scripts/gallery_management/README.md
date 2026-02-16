# Gallery Management System

> **Modern web interface and automated script for managing the home page gallery**

This system provides an intuitive web interface and automated script for managing the rotating gallery on your home page. Images are stored on **Cloudinary CDN** for optimal performance, making it easy for non-technical users to update their gallery.

## 🎨 Web Interface Features

- **Visual Gallery Management** - Drag and drop interface for image management
- **Live Preview** - See exactly how your changes will look
- **Automatic Image Processing** - Handles image optimization and formatting
- **Intuitive Controls** - Add, remove, and reorder images with ease
- **Real-time Validation** - Instant feedback on image compatibility
- **One-Click Command Copy** - Auto-generates the necessary command to run

## 🤖 Automation Features

- **One-Click Execution** - Run changes directly from the web interface
- **Cloudinary Integration** - Automatic upload to CDN with optimization
- **Quality Assurance** - Automatic code formatting and linting
- **Preview Environment** - Development server for change verification
- **Live Updates** - Changes are immediately live on Cloudinary CDN

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
3. **Validate** - Automatic image format validation
4. **Execute** - One-click to upload to Cloudinary
5. **Review** - Preview in development environment
6. **Done** - Images are immediately live on CDN

## ☁️ Cloudinary CDN

Images are hosted on Cloudinary with automatic optimization:
- **Format Support** - Handles `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
- **Auto Optimization** - Cloudinary automatically optimizes format and quality
- **Global CDN** - Fast delivery worldwide
- **No Local Storage** - Images are not stored in the repository

## 🔄 How It Works

1. **Validation** - Check image formats
2. **Upload** - Images are uploaded to Cloudinary CDN
3. **Optimization** - Cloudinary handles format/quality optimization
4. **Preview** - Launch development environment to verify
5. **Live** - Changes are immediately available on the CDN

## 🛡️ Notes

- **Immediate Updates** - Changes to Cloudinary are live immediately
- **Format Validation** - Ensures image compatibility before upload
- **Error Handling** - Clear feedback on upload failures
- **Manual Revert** - If needed, re-upload/delete images manually

## 👩‍💻 Developer Commands

*Note: Requires `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` environment variables.*

```bash
# List current images from Cloudinary
python3 -m scripts.gallery_management.gallery_manager list

# Add images (uploads to Cloudinary)
python3 -m scripts.gallery_management.gallery_manager add ~/Desktop/image1.jpg ~/Desktop/image2.png

# Remove images (deletes from Cloudinary)
python3 -m scripts.gallery_management.gallery_manager remove IMG_1508.jpeg IMG_1628.jpeg
```

---

**Modern Web Interface** | **Cloudinary CDN** | **Non-Technical User Friendly**