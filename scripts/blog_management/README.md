# Blog Management System

> **A Python-based content management system that generates React blog components from JSON configurations**

This system automates the creation and deployment of travel blog posts, supporting both international destinations and US state-specific content. It generates complete React components with routing, handles asset management, and provides both CLI and web-based interfaces.

## 🚀 Quick Overview

**What it does:**
- Converts JSON blog configurations into fully functional React components
- Automatically handles file structure, routing, and asset organization
- Supports rich content layouts (text, image grids, itineraries with maps)
- Provides both terminal-based and web-based interfaces
- Includes automatic link formatting and country/state validation

**Use cases:**
- Travel bloggers managing multiple destination posts
- Content creators needing consistent blog structures
- Teams requiring standardized content generation workflows

## 📋 Content Structure

### Blog Layout Options
- **Text Sections** - Standard paragraphs with markdown link support
- **Two-Column Layouts** - Side-by-side image and text combinations
- **Image Grids** - Responsive photo galleries
- **Interactive Itineraries** - Day-by-day plans with embedded Google Maps

### Easy Link Formatting
Use markdown syntax `[text](url)` in any content field - automatically converts to properly styled HTML links with security attributes (`target="_blank"`, `rel="noopener noreferrer"`).

```json
"content": "Visit [Paris](https://en.wikipedia.org/wiki/Paris) for amazing [museums](https://www.louvre.fr)!"
```

## 📁 File Structure

### Input Structure (Desktop folder)
```
my-blog-folder/
├── blog_config.json     # Blog configuration
├── background.jpg       # Main background image
└── content-images/      # Additional photos
```

### Generated Output
```
src/pages/BlogPage/Blogs/france/1/
├── FrancePost1.tsx           # Main component
├── FrancePost1.constants.ts  # Content constants
└── FrancePost1.types.ts      # TypeScript types
```

## ⚙️ Configuration

### Required Fields
```json
{
  "country": "France",
  "country_code": "FR",
  "title": "🗼 Paris: City of Lights",
  "background_image": "paris-bg.jpg",
  "blog_description": "Exploring romantic Paris",
  "blog": {
    "header": "Main blog header",
    "subtitle": "Blog subtitle",
    "description": "Opening paragraph",
    "content": [ "content sections array" ]
  }
}
```

### Optional Fields
- `state` - Required for US destinations (`"country": "United States"`)
- `tips_section` - Travel tips with external link support
- `itineraries` - Structured day-by-day plans
- `maps` - Google Maps embed URLs

### US State Support
```json
{
  "country": "United States",
  "country_code": "US",
  "state": "California",
  "title": "🌴 California Adventures"
}
```

## 🖥️ Usage Options

### 1. Terminal Interface
```bash
# From project root
python3 -m scripts.blog_management.blog_manager

# Or from scripts directory
cd scripts/blog_management
./generate
```

### 2. Web Admin Interface
- Navigate to `/admin` in your web application
- Fill out the blog generation form
- Real-time preview and JSON export
- Automatic country/state validation

## 🛠️ Technical Features

- **Automatic routing generation** - Updates React Router configurations
- **Asset optimization** - Handles image copying and organization
- **TypeScript support** - Generates proper type definitions
- **Development integration** - Auto-starts/stops dev server for testing
- **Validation** - JSON schema validation and country code verification
- **Error handling** - Comprehensive error reporting and recovery

## 📖 Templates & Examples

- `blog_template.json` - Basic template with all required fields
- `sample_blog_data.json` - Complete example with all layout types
- `example_blog.json` - Real-world blog post example

**Built with:** Python 3, React, TypeScript | **Dependencies:** i18n-iso-countries, file management utilities