# Blog Management System

This system allows you to easily create and deploy blog posts for the Around The World 50s website. It supports both **simple** and **enhanced** blog structures.

## Quick Start

1. Create a folder on your Desktop with your blog content
2. Add a JSON configuration file and images to the folder
3. Run the blog generation script
4. Review and deploy your blog post

## Blog Types

### Simple Blogs
Basic blog posts with minimal structure - just a title, background image, and description.

### Enhanced Blogs
Rich blog posts with multiple content sections, maps, image grids, and complex layouts.

## Setting Up Your Blog

### Step 1: Create a Folder on Your Desktop
Create a folder with any name (e.g., "my-paris-trip") on your Desktop.

### Step 2: Add Your Images
Place all your blog images in this folder. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

**Image Naming Guidelines:**
- Use lowercase letters, numbers, and hyphens only
- Examples: `eiffel-tower.jpg`, `cafe-scene-1.png`

### Step 3: Create Your JSON Configuration

#### For Simple Blogs
Create a JSON file with the required fields:

```json
{
  "country": "France",
  "country_code": "FR",
  "title": "🗼 Paris: City of Lights and Love",
  "background_image": "paris-main.jpg",
  "blog_description": "✨ Exploring the romantic streets and hidden gems of Paris 🥖"
}
```

#### For Enhanced Blogs
Create a JSON file with the `enhanced_blog` structure:

```json
{
  "country": "France",
  "country_code": "FR",
  "title": "🗼 Paris: City of Lights and Love",
  "background_image": "paris-main.jpg",
  "blog_description": "✨ Exploring the romantic streets and hidden gems of Paris 🥖",

  "enhanced_blog": {
    "header": "🗼 Paris: City of Lights and Love",
    "subtitle": "A magical journey through the most romantic city in the world",
    "description": "Your opening story paragraph that sets the scene...",
    "tips_section": "💡 Pro Tips: Essential Paris insights",

    "itineraries": [
      {
        "title": "Day 1 - Classic Paris 📍",
        "items": [
          "📌 Eiffel Tower at sunrise",
          "📌 Seine River cruise",
          "📌 Louvre Museum",
          "📌 Champs-Élysées stroll"
        ]
      }
    ],

    "maps": [
      {
        "name": "parisMap",
        "title": "Paris Highlights Map",
        "url": "https://www.google.com/maps/embed?pb=YOUR_GOOGLE_MAPS_EMBED_URL"
      }
    ],

    "content": [
      {
        "key": "firstItinerary",
        "layout": {
          "type": "itinerary-with-map",
          "map_index": 0
        },
        "content": null
      },
      {
        "key": "introduction",
        "layout": {
          "type": "text"
        },
        "content": "Your story begins here..."
      }
    ]
  }
}
```

## Enhanced Blog Layout Types

### 1. Text Layout
Simple text paragraphs for storytelling.

```json
{
  "key": "myStory",
  "layout": {
    "type": "text"
  },
  "content": "Your paragraph content here..."
}
```

### 2. Two-Column Layout
Side-by-side image and text combinations.

```json
{
  "key": "experience",
  "layout": {
    "type": "two-column",
    "left_type": "image",
    "right_type": "text",
    "image_alt": "Description of the image"
  },
  "content": "Your story text...",
  "left_image": "your-image.jpg"
}
```

**Options:**
- `left_type` / `right_type`: `"image"` or `"text"`
- `left_image` / `right_image`: Image filename
- `image_alt`: Alt text for accessibility

### 3. Image Grid Layout
Grid display of multiple images.

```json
{
  "key": "photoGrid",
  "layout": {
    "type": "image-grid"
  },
  "content": null,
  "images": [
    "photo1.jpg",
    "photo2.jpg",
    "photo3.jpg",
    "photo4.jpg"
  ]
}
```

### 4. Itinerary with Map Layout
Itinerary list paired with an interactive map.

```json
{
  "key": "dayOne",
  "layout": {
    "type": "itinerary-with-map",
    "map_index": 0
  },
  "content": null
}
```

**Note:** `map_index` refers to the index in your `maps` array.

## Getting Google Maps Embed URLs

1. Go to [Google Maps](https://maps.google.com)
2. Search for your location or create a custom map
3. Click "Share"
4. Click "Embed a map"
5. Copy the URL from the `src` attribute
6. Use this URL in your `maps` array

## Running the Script

### Prerequisites
- Python 3.x installed
- Node.js and npm installed
- Git repository initialized

### Command
```bash
# From your project root directory
./scripts/blog_management/add_blog.sh
```

Or run directly with Python:
```bash
python3 -m scripts.blog_management.blog_manager
```

### The Process
1. **Enter folder name**: Type the name of your blog folder on Desktop
2. **Validation**: The script validates your JSON structure
3. **Generation**: Creates the appropriate blog files (simple .js or enhanced .tsx)
4. **Development server**: Automatically starts the dev server for preview
5. **Review**: Check your blog post in the browser
6. **Deploy**: Confirm to deploy or revert changes

## File Structure Generated

### Simple Blogs
```
src/pages/BlogPage/Blogs/your-country/1/
├── YourCountryPost1.js
```

### Enhanced Blogs
```
src/pages/BlogPage/Blogs/your-country/1/
├── YourCountryPost1.tsx
├── YourCountryPost1.types.ts
└── YourCountryPost1.constants.ts
```

## Templates

Use these template files as starting points:

- **Simple blog**: `scripts/blog_management/blog_template.json`
- **Enhanced blog**: `scripts/blog_management/enhanced_blog_template.json`

## Troubleshooting

### Common Issues

**"JSON file not formatted correctly"**
- Validate your JSON using an online JSON validator
- Check for missing commas, quotes, or brackets

**"Background image not found"**
- Ensure the image filename in JSON matches the actual file
- Check that the image is in your blog folder

**"Missing required fields"**
- Ensure all required fields are present: `country`, `country_code`, `title`, `background_image`, `blog_description`

**"Google Maps not displaying"**
- Verify your embed URL is complete and starts with `https://www.google.com/maps/embed`
- Test the URL by pasting it into a browser

### Getting Help

If you encounter issues:
1. Check the console output for specific error messages
2. Verify your JSON structure against the templates
3. Ensure all images are properly named and formatted
4. Try running the script again with a fresh copy of the template

## Advanced Features

### State/Region Support
Add a `state` field for locations with states or regions:

```json
{
  "country": "United States",
  "state": "California",
  "country_code": "US",
  ...
}
```

### Multiple Itineraries
You can have multiple itineraries with corresponding maps:

```json
"itineraries": [
  {"title": "Day 1", "items": [...]},
  {"title": "Day 2", "items": [...]}
],
"maps": [
  {"name": "day1Map", "title": "Day 1 Map", "url": "..."},
  {"name": "day2Map", "title": "Day 2 Map", "url": "..."}
]
```

### Content Ordering
Content sections are rendered in the order they appear in your `content` array. Plan your blog flow accordingly.

---

Happy blogging! 🌍✈️📝