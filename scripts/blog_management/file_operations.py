"""File operations for blog management."""
from pathlib import Path
import shutil
import json
import re
import sys
from datetime import datetime
from utils import (
    serialize_location,
    create_component_name,
    create_constants_name,
    convert_markdown_links,
    normalize_us_country,
    normalize_state_name,
    is_us_country
)

# Import Cloudinary utilities
sys.path.insert(0, str(Path(__file__).parent.parent))
from cloudinary_utils import upload_blog_images, configure_cloudinary

def setup_directories(base_dir, country_name, post_index, state_name=None):
    """Create necessary directories for blog components (images go to Cloudinary)."""
    if state_name and is_us_country(country_name, None):
        # For US states, use state-specific serialization
        serialized_location = f"united-states-{serialize_location(state_name)}"
    else:
        serialized_location = serialize_location(country_name)

    # Only create blog component directory (images go to Cloudinary now)
    blog_component_dir = base_dir / "src/pages/BlogPage/Blogs" / serialized_location / str(post_index)

    if blog_component_dir.exists():
        print(f"\nError: Blog component directory already exists: {blog_component_dir}")
        print("This indicates a problem with the post index calculation.")
        sys.exit(1)

    blog_component_dir.mkdir(parents=True)

    # Return the blog path for Cloudinary uploads
    blog_path = f"{serialized_location}/{post_index}"
    return blog_path, blog_component_dir

def upload_images(source_dir, blog_path, background_image):
    """Upload images from source directory to Cloudinary."""
    # Verify background image exists
    bg_path = source_dir / background_image
    if not bg_path.exists():
        print(f"Error: Background image '{background_image}' not found in the source folder")
        sys.exit(1)

    # Configure and upload to Cloudinary
    if not configure_cloudinary():
        print("\n⚠️  Cloudinary not configured. Please set environment variables:")
        print('  export CLOUDINARY_API_KEY="your_api_key"')
        print('  export CLOUDINARY_API_SECRET="your_api_secret"')
        sys.exit(1)

    # Upload all images to Cloudinary
    uploaded = upload_blog_images(source_dir, blog_path)
    if not uploaded:
        print("Error: No images were uploaded to Cloudinary")
        sys.exit(1)

    return uploaded

# Keep old function name for backwards compatibility
def copy_images(source_dir, blog_path, background_image):
    """Deprecated: Use upload_images instead. This now uploads to Cloudinary."""
    return upload_images(source_dir, blog_path, background_image)

def update_blogs_js(base_dir, blog_data, post_index):
    """Update the blogs.js file with the new blog entry."""
    blogs_file = base_dir / "src/data/blogs.js"

    # Read existing blogs.js content
    with open(blogs_file, 'r') as f:
        content = f.read()

    # Normalize country data
    normalized_country, normalized_country_code = normalize_us_country(
        blog_data['country'],
        blog_data['country_code']
    )

    # Create serialized location and unique ID
    if blog_data.get('state') and is_us_country(blog_data['country'], blog_data['country_code']):
        # For US states, normalize and serialize state name
        normalized_state = normalize_state_name(blog_data['state'])
        serialized_location = f"united-states-{serialize_location(normalized_state)}"
        unique_id = f"{serialized_location}-{post_index}"
    else:
        serialized_location = serialize_location(normalized_country)
        unique_id = f"{serialized_location}-{post_index}"

    new_blog = {
        "id": unique_id,
        "created_at": datetime.now().strftime('%Y-%m-%d'),
        "country": normalized_country,
        "country_code": normalized_country_code,
        "title": blog_data['title'],
        "folder": f"{serialized_location}/{post_index}",
        "background_image": blog_data['background_image'],
        "path": f"/blog/{serialized_location}/{post_index}",
        "blog_description": blog_data['blog_description']
    }

    if 'state' in blog_data:
        new_blog['state'] = normalize_state_name(blog_data['state'])

    blog_entry = json.dumps(new_blog, indent=2, ensure_ascii=False)
    blog_entry = re.sub(r'(\s+)"([^"]+)":', r'\1\2:', blog_entry)

    # Find the end of the array
    array_end = content.rindex('];')

    # Check if we need to add a comma (if there are existing entries)
    if content[:array_end].strip().endswith('},'):
        # There are existing entries, add new entry with same formatting
        new_content = content[:array_end] + '  ' + blog_entry + ',\n' + content[array_end:]
    else:
        # This is the first entry
        new_content = content[:array_end] + '  ' + blog_entry + '\n' + content[array_end:]

    with open(blogs_file, 'w') as f:
        f.write(new_content)

def create_blog_component(blog_component_dir, blog_data, post_index):
    """Create blog component with full functionality."""
    if blog_data.get('state') and is_us_country(blog_data['country'], blog_data['country_code']):
        # For US states, use state-specific serialization
        serialized_location = f"united-states-{serialize_location(blog_data['state'])}"
    else:
        serialized_location = serialize_location(blog_data['country'])

    component_name = create_component_name(blog_data['country'], blog_data.get('state'))
    component_name = f"{component_name}Post{post_index}"
    constants_name = create_constants_name(blog_data['country'], blog_data.get('state'))
    constants_name = f"{constants_name}_POST_{post_index}"

    filename = f"{component_name}.tsx"
    blog_content = blog_data['blog']

    # Create blog path for ImageGrid
    blog_path = f"{serialized_location}/{post_index}"

    # Generate map components
    maps_code = ""
    if 'maps' in blog_content:
        for i, map_data in enumerate(blog_content['maps']):
            maps_code += f'''  const {map_data['name']} = (
    <MapEmbed
      title="{map_data['title']}"
      url="{map_data['url']}"
    />
  );

'''

    component_content = f'''import React from "react";
import "../../../../../styles/layout.css";
import "../../BlogPost.css";
import TwoColumnLayout from "../../../../../components/TwoColumnLayout/TwoColumnLayout";
import ImageGrid from "../../../../../components/ImageGrid/ImageGrid";
import MapEmbed from "../../../../../components/MapEmbed/MapEmbed";
import InstagramEmbedSection from "../../../../../pages/HomePage/components/InstagramEmbedSection";
import {{ {constants_name} }} from "./{component_name}.constants.ts";
import {{ ContentSection }} from "./{component_name}.types";
import {{ getImagePathFromBlogPost }} from "../../BlogPost.utils.ts";

const {component_name} = () => {{
{maps_code}  let itinerary: {{ title: string; items: string[] }};

  const maps = [{', '.join([f'{map_data["name"]}' for map_data in blog_content.get('maps', [])])}];

  const renderContent = (section: ContentSection) => {{
    switch (section.layout.type) {{
      case "text":
        return (
          <div
            key={{section.key}}
            className="post-description"
            dangerouslySetInnerHTML={{{{ __html: section.content || "" }}}}
          />
        );
      case "itinerary-with-map":
        itinerary = {constants_name}.itineraries[section.layout.mapIndex];
        return (
          <TwoColumnLayout
            leftPane={{{{
              type: "list",
              listTitle: itinerary.title,
              listItems: itinerary.items,
            }}}}
            rightPane={{{{
              type: "map",
              mapComponent: maps[section.layout.mapIndex],
            }}}}
          />
        );
      case "image-grid":
        return <ImageGrid
          images={{section.images || []}}
          blogPath="{blog_path}"
        />;
      case "two-column":
        return (
          <TwoColumnLayout
            leftPane={{{{
              type: section.layout.leftType,
              imageUrl:
                section.layout.leftType === "image"
                  ? getImagePathFromBlogPost({constants_name}, section.leftImage || "")
                  : undefined,
              imageAlt: section.layout.imageAlt,
              content:
                section.layout.leftType === "text"
                  ? section.content
                  : undefined,
            }}}}
            rightPane={{{{
              type: section.layout.rightType,
              imageUrl:
                section.layout.rightType === "image"
                  ? getImagePathFromBlogPost({constants_name}, section.rightImage || "")
                  : undefined,
              imageAlt: section.layout.imageAlt,
              content:
                section.layout.rightType === "text"
                  ? section.content
                  : undefined,
            }}}}
          />
        );
      case "instagram":
        return <InstagramEmbedSection />;
      default:
        return null;
    }}
  }};

  return (
    <div className="page-container">
      <div
        className="fixed-background-container"
        style={{{{
          backgroundImage: `url(${{getImagePathFromBlogPost({constants_name}, {constants_name}.backgroundImage || "")}})`,
        }}}}
      >
        <div className="fixed-background-text-container">
          <div className="fixed-background-title fixed-background-no-margin">
            {{{constants_name}.header}}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="page-content">
          <div className="post-title">{{{constants_name}.title}}</div>

          <div className="post-subtitle">{{{constants_name}.subtitle}}</div>

          <div
            className="post-description"
            dangerouslySetInnerHTML={{{{ __html: {constants_name}.description }}}}
          />

          {{{constants_name}.tipsSection && (
            <div className="post-bolded-text post-tips-section-container">
              {{{constants_name}.tipsLink ? (
                <a
                  href={{{constants_name}.tipsLink}}
                  className="post-tips-link"
                  dangerouslySetInnerHTML={{{{ __html: {constants_name}.tipsSection }}}}
                />
              ) : (
                <div dangerouslySetInnerHTML={{{{ __html: {constants_name}.tipsSection }}}} />
              )}}
            </div>
          )}}

          {{{constants_name}.content.map((item, index) => (
            <div key={{item.key || index}}>
              {{renderContent(item)}}
            </div>
          ))}}
        </div>
      </div>
    </div>
  );
}};

export default {component_name};
'''

    with open(blog_component_dir / filename, 'w') as f:
        f.write(component_content)

def create_blog_types(blog_component_dir, blog_data, post_index):
    """Create TypeScript types file for blog."""
    component_name = create_component_name(blog_data['country'], blog_data.get('state'))
    component_name = f"{component_name}Post{post_index}"
    filename = f"{component_name}.types.ts"

    types_content = '''// Re-export shared types for this blog post
export {
  BlogPostContent,
  ContentSection,
  Itinerary,
  LayoutType
} from "../../BlogPost.types";
'''

    with open(blog_component_dir / filename, 'w') as f:
        f.write(types_content)

def create_blog_constants(blog_component_dir, blog_data, post_index):
    """Create constants file for blog."""
    if blog_data.get('state') and is_us_country(blog_data['country'], blog_data['country_code']):
        # For US states, use state-specific serialization
        serialized_location = f"united-states-{serialize_location(blog_data['state'])}"
    else:
        serialized_location = serialize_location(blog_data['country'])

    component_name = create_component_name(blog_data['country'], blog_data.get('state'))
    component_name = f"{component_name}Post{post_index}"
    constants_name = create_constants_name(blog_data['country'], blog_data.get('state'))
    constants_name = f"{constants_name}_POST_{post_index}"

    filename = f"{component_name}.constants.ts"
    blog_content = blog_data['blog']

    # Convert content sections
    content_sections = []
    for section in blog_content.get('content', []):
        section_obj = {
            'key': section['key'],
            'layout': convert_layout_structure(section['layout']),
            'content': convert_markdown_links(section.get('content')) if section.get('content') else None,
        }

        # Add optional fields
        if 'images' in section:
            section_obj['images'] = section['images']
        if 'leftImage' in section:
            section_obj['leftImage'] = section['leftImage']
        if 'rightImage' in section:
            section_obj['rightImage'] = section['rightImage']

        content_sections.append(section_obj)

    # Convert itineraries
    itineraries = blog_content.get('itineraries', [])

    # Create the variable name for the content object - use serialized location for consistency
    content_var_name = f"{serialized_location.replace('-', '')}Content"

    # Convert markdown links and properly format the description and other text fields
    description = convert_markdown_links(blog_content['description']).replace('`', '\\`').replace('${', '\\${')
    tips_section = convert_markdown_links(blog_content.get('tips_section', '')).replace('`', '\\`').replace('${', '\\${')
    tips_link = f"/aroundtheworld50s#{blog_content.get('tips_link', '')}"

    # Serialize the data properly
    itineraries_json = json.dumps(itineraries, indent=2).replace('\n', '\n    ')
    content_sections_json = json.dumps(content_sections, indent=2).replace('\n', '\n    ')

    constants_content = f'''import {{ BlogPostContent }} from './{component_name}.types';

export const createBlogPost = (content: BlogPostContent): BlogPostContent => ({{
  country: content.country,
  path: content.path,
  header: content.header,
  title: content.title,
  subtitle: content.subtitle,
  description: content.description,
  tipsSection: content.tipsSection,
  tipsLink: content.tipsLink,
  backgroundImage: content.backgroundImage,
  itineraries: content.itineraries || [],
  content: content.content || [],
}});

// Specific content for {blog_data['country']} post
const {content_var_name}: BlogPostContent = {{
  country: "{blog_data['country']}",
  path: "{serialized_location}/{post_index}",
  header: "{blog_content['header']}",
  title: "{blog_data['title']}",
  subtitle: "{blog_content['subtitle']}",
  backgroundImage: "{blog_data['background_image']}",
  description: `{description}`,
  tipsSection: "{tips_section}",
  tipsLink: "{tips_link}",
  itineraries: {itineraries_json},
  content: {content_sections_json},
}};

// Create the blog post using the generic structure
export const {constants_name} = createBlogPost({content_var_name});
'''

    with open(blog_component_dir / filename, 'w') as f:
        f.write(constants_content)

def convert_layout_structure(layout):
    """Convert JSON layout structure to TypeScript format."""
    converted = {"type": layout["type"]}

    if layout["type"] == "itinerary-with-map":
        converted["mapIndex"] = layout.get("map_index", 0)
    elif layout["type"] == "two-column":
        converted["leftType"] = layout.get("leftType", "text")
        converted["rightType"] = layout.get("rightType", "text")
        if "imageAlt" in layout:
            converted["imageAlt"] = layout["imageAlt"]

    return converted

def update_app_js(base_dir, blog_data, post_index):
    """Update App.js with the new blog route."""
    app_file = base_dir / "src/App.js"

    if blog_data.get('state') and is_us_country(blog_data['country'], blog_data['country_code']):
        # For US states, use state-specific serialization
        serialized_location = f"united-states-{serialize_location(blog_data['state'])}"
    else:
        serialized_location = serialize_location(blog_data['country'])

    component_name = create_component_name(blog_data['country'], blog_data.get('state'))
    component_name = f"{component_name}Post{post_index}"
    file_extension = ".tsx"

    with open(app_file, 'r') as f:
        content = f.read()

    # Add import statement after the last import
    import_line = f"import {component_name} from './pages/BlogPage/Blogs/{serialized_location}/{post_index}/{component_name}{file_extension}';\n"
    last_import_index = content.rindex('import')
    last_import_line_end = content.find('\n', last_import_index) + 1
    content = content[:last_import_line_end] + import_line + content[last_import_line_end:]

    switch_case = f'''    case "{serialized_location}":
      if (index === "{post_index}") {{
        return <{component_name} />;
      }}
      break;\n'''

    switch_index = content.find('switch (postName) {')
    default_case_index = content.find('default:', switch_index)

    # If this is the first case for this location, add the whole case
    # If the location case exists, add just the if statement
    location_case_index = content.find(f'case "{serialized_location}":', switch_index, default_case_index)

    if location_case_index == -1:
        # Location doesn't exist yet, add new case before default
        content = content[:default_case_index] + switch_case + content[default_case_index:]
    else:
        # Location exists, find the break statement and add before it
        break_index = content.find('break;', location_case_index)
        if_statement = f'''      if (index === "{post_index}") {{
        return <{component_name} />;
      }}\n'''
        content = content[:break_index] + if_statement + content[break_index:]

    with open(app_file, 'w') as f:
        f.write(content)