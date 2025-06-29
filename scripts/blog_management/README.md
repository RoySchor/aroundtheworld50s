# Blog Management System

This system helps you create and manage blog posts for your travel website. It supports both country-level blogs and US state-specific blogs.

### Features

- **Country Blogs**: Create blogs for any country (e.g., France, Japan, Trinidad and Tobago)
- **US State Blogs**: Create state-specific blogs for the United States (e.g., California, New York, Texas)
- **Automatic file generation**: Creates all necessary React components, constants, and routing
- **Content sections**: Support for text, two-column layouts, image grids, and itinerary-with-map sections
- **Markdown link conversion**: Automatically converts `[text](url)` to proper HTML links
- **Asset management**: Handles image copying and organization
- **Development server integration**: Automatically starts/stops the dev server for testing

### Quick Start

1. **Create your blog folder** on Desktop (e.g., `california-blog`, `france-blog`)
2. **Add your JSON configuration file** (copy from `blog_template.json`)
3. **Add your images** to the same folder
4. **Run the generation script**: `./generate` (from this directory)

### US State Support

For US state blogs, use this structure in your JSON:

```json
{
  "country": "United States",
  "country_code": "US",
  "state": "California",
  "title": "🌴 California: Golden State Adventures",
  // ... rest of your blog data
}
```

**Important**: The state field is **required** when the country is "United States", "USA", or country_code is "US".

### Blog Structure

Your blog folder should contain:
- **One JSON file** with your blog configuration
- **Background image** (referenced in the JSON)
- **Additional images** for content sections

### Content Sections

The system supports four types of content sections:

1. **Text Section**: Pure text content with markdown link support
2. **Two-Column Layout**: Image + text in left/right configuration
3. **Image Grid**: Multiple images in a responsive grid
4. **Itinerary with Map**: Combines itinerary lists with embedded maps

### Examples

#### Country Blog (France)
```json
{
  "country": "France",
  "country_code": "FR",
  "title": "🗼 Paris: City of Lights",
  "background_image": "paris-bg.jpg",
  "blog_description": "Exploring romantic Paris",
  "blog": {
    // ... blog content
  }
}
```

#### US State Blog (California)
```json
{
  "country": "United States",
  "country_code": "US",
  "state": "California",
  "title": "🌴 California Adventures",
  "background_image": "california-bg.jpg",
  "blog_description": "Golden State exploration",
  "blog": {
    // ... blog content
  }
}
```

### File Paths

The system automatically creates appropriate file paths:

- **Country blogs**: `/blog/france/1`, `/blog/trinidad-and-tobago/1`
- **US state blogs**: `/blog/united-states-california/1`, `/blog/united-states-texas/1`

### Scripts

- **`generate`**: Main script to generate blog from folder
- **`add_blog.sh`**: Alternative blog addition script
- **`auto_generate_blog.sh`**: Automated blog generation

### Troubleshooting

If you encounter issues:
1. Check that your JSON file is valid
2. Ensure all required fields are present
3. Verify image files exist in your folder
4. For US blogs, make sure the state field is included

### Admin Interface

You can also use the web admin interface at `/admin` to create blogs through a user-friendly form. The admin interface automatically shows the state field when you select "United States" as the country.

## Quick Start

1. Create a folder on your Desktop with your blog content
2. Add a JSON configuration file and images to the folder
3. Run the blog generation script
4. Review and deploy your blog post

## Blog Structure

All blogs use a content structure with multiple layout types including:
- **Text sections** - Regular paragraphs for storytelling
- **Two-column layouts** - Side-by-side image and text combinations
- **Image grids** - Collections of photos in a responsive grid
- **Itinerary with maps** - Interactive itineraries with embedded Google Maps

## Setting Up Your Blog

### Step 1: Create a Folder on Your Desktop
Create a folder with any name (e.g., "my-paris-trip") on your Desktop.

### Step 2: Add Your Images
Place all your blog images in this folder. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

**Image Naming Guidelines:**
- Use lowercase letters, numbers, and hyphens only
- Examples: `eiffel-tower.jpg`, `cafe-scene-1.png`

### Step 3: Create Your JSON Configuration

Create a JSON file with the blog structure:

```json
{
  "country": "France",
  "country_code": "FR",
  "title": "🗼 Paris: City of Lights and Love",
  "background_image": "paris-main.jpg",
  "blog_description": "✨ Exploring the romantic streets and hidden gems of Paris 🥖",

  "blog": {
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

## Blog Layout Types

### 1. Text Layout
Simple text paragraphs for storytelling.

```json
{
  "key": "myStory",
  "layout": {
    "type": "text"
  },
  "content": "Your paragraph content here with [embedded links](https://en.wikipedia.org/wiki/Russia)..."
}
```

**✨ Easy Link Formatting**: Use markdown syntax `[link text](url)` in any text content. The system automatically converts them to properly formatted HTML links with the correct styling and attributes (`className="post-link"`, `target="_blank"`, `rel="noopener noreferrer"`).

**Examples:**
- `[Wikipedia](https://en.wikipedia.org/wiki/Paris)` → becomes a styled external link
- `[Tourism Site](https://www.visitparis.com)` → becomes a styled external link
- Works in all text fields: descriptions, content sections, tips sections, etc.

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
Display multiple images in a responsive grid.

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
Interactive itinerary paired with an embedded map.

```json
{
  "key": "dayOneItinerary",
  "layout": {
    "type": "itinerary-with-map",
    "map_index": 0
  },
  "content": null
}
```

**Note:** The `map_index` corresponds to the position in your `maps` array.

## Adding Embedded Links

You can add clickable links to any text content in your blog posts. This works in:
- Main blog description
- Tips section
- Text layout sections
- Two-column layout text content

### Link Format
```json
{
  "content": "Visit <a href=\"https://en.wikipedia.org/wiki/Russia\" target=\"_blank\" rel=\"noopener noreferrer\">Russia</a> for an amazing experience."
}
```

### Link Attributes Explained
- `href`: The URL to link to
- `target="_blank"`: Opens link in a new tab
- `rel="noopener noreferrer"`: Security best practice for external links

### Examples

**Wikipedia Links:**
```json
{
  "content": "Our journey to <a href=\"https://en.wikipedia.org/wiki/Moscow\" target=\"_blank\" rel=\"noopener noreferrer\">Moscow</a>, the capital of <a href=\"https://en.wikipedia.org/wiki/Russia\" target=\"_blank\" rel=\"noopener noreferrer\">Russia</a>, was unforgettable."
}
```

**Tourism Websites:**
```json
{
  "content": "Check out the official <a href=\"https://www.visitrussia.org.uk/\" target=\"_blank\" rel=\"noopener noreferrer\">Visit Russia</a> website for more information."
}
```

**Google Maps Links:**
```json
{
  "content": "We visited <a href=\"https://maps.google.com/?q=Red+Square+Moscow\" target=\"_blank\" rel=\"noopener noreferrer\">Red Square</a> in the heart of the city."
}
```

**Multiple Links in One Section:**
```json
{
  "content": "From <a href=\"https://en.wikipedia.org/wiki/Moscow\" target=\"_blank\" rel=\"noopener noreferrer\">Moscow</a> to <a href=\"https://en.wikipedia.org/wiki/Saint_Petersburg\" target=\"_blank\" rel=\"noopener noreferrer\">St. Petersburg</a>, every city in <a href=\"https://en.wikipedia.org/wiki/Russia\" target=\"_blank\" rel=\"noopener noreferrer\">Russia</a> has its own unique charm."
}
```

### Where Links Work
✅ **Supported in:**
- Blog description (main intro paragraph)
- Tips section
- Text layout sections
- Two-column layout text content

❌ **Not supported in:**
- Itinerary items (these are plain text lists)
- Image alt text
- Blog titles and subtitles

## Maps Setup

1. Go to Google Maps
2. Search for your locations and create a custom map
3. Click "Share" → "Embed a map"
4. Copy the URL from the `src` attribute
5. Add to your `maps` array with a unique `name`

## Required vs Optional Fields

### Required Fields
- `country`: Country name
- `country_code`: Two-letter country code (e.g., "FR")
- `title`: Blog post title with emojis
- `background_image`: Main background image filename
- `blog_description`: Short description with emojis
- `blog`: Object containing the rich content structure

### Blog Object Required Fields
- `header`: Blog header text (displayed on background)
- `subtitle`: Blog subtitle
- `description`: Opening paragraph
- `content`: Array of content sections

### Optional Fields
- `state`: State or region name (if applicable)
- `tips_section`: Tips section text
- `itineraries`: Array of itinerary objects
- `maps`: Array of Google Maps embeds

## Running the Script

### From Terminal
```bash
cd /path/to/around-the-world-50s
python3 -m scripts.blog_management.blog_manager
```

### From Script Directory
```bash
cd scripts/blog_management
./add_blog.sh
```

## Templates Available

- **Complete example**: `scripts/blog_management/blog_template.json`
- **Rich template**: `scripts/blog_management/enhanced_blog_template.json`
- **Test example**: `scripts/blog_management/example_enhanced_blog.json`

## Troubleshooting

### Common Issues
1. **JSON formatting errors**: Use a JSON validator to check your file
2. **Missing images**: Ensure all referenced images are in your folder
3. **Google Maps not working**: Double-check your embed URL
4. **Build errors**: Run `npm run lint:fix` manually if needed

### File Structure
Your desktop folder should look like:
```
my-blog-folder/
├── blog_data.json
├── main-background.jpg
├── photo1.jpg
├── photo2.jpg
└── ...other images
```

## Tips for Great Blogs

1. **Start with a compelling opening** - Hook your readers immediately
2. **Mix content types** - Alternate between text, images, and maps
3. **Use high-quality images** - Compress but maintain visual appeal
4. **Tell a story** - Structure your content with a clear narrative
5. **Include practical tips** - Help future travelers with actionable advice
6. **Optimize for mobile** - Content automatically adapts to screen sizes

## Support

For issues or questions:
1. Check the templates for examples
2. Validate your JSON structure
3. Ensure all images are properly named and included
4. Run the linter to check for code issues