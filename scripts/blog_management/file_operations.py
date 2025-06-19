"""File operations for blog management."""
from pathlib import Path
import shutil
import json
import re
import sys
from datetime import datetime
from .utils import serialize_location, create_component_name, create_constants_name

def setup_directories(base_dir, country_name, post_index):
    """Create necessary directories for assets and data."""
    serialized_country = serialize_location(country_name)

    # Create directories
    assets_dir = base_dir / "src/assets/blog" / serialized_country / str(post_index)
    blog_component_dir = base_dir / "src/pages/BlogPage/Blogs" / serialized_country / str(post_index)

    for directory in [assets_dir, blog_component_dir]:
        directory.mkdir(parents=True, exist_ok=True)

    return assets_dir, blog_component_dir

def copy_images(source_dir, assets_dir, background_image):
    """Copy images from source directory to assets directory."""
    # Verify background image exists
    bg_path = source_dir / background_image
    if not bg_path.exists():
        print(f"Error: Background image '{background_image}' not found in the source folder")
        sys.exit(1)

    # Copy all images
    for file in source_dir.glob("*"):
        if file.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp', '.gif']:
            shutil.copy2(file, assets_dir)

def update_blogs_js(base_dir, blog_data, post_index):
    """Update the blogs.js file with the new blog entry."""
    blogs_file = base_dir / "src/data/blogs.js"

    # Read existing blogs.js content
    with open(blogs_file, 'r') as f:
        content = f.read()

    # Create new blog entry with unique ID
    serialized_country = serialize_location(blog_data['country'])
    unique_id = f"{serialized_country}-{post_index}"  # Create unique ID from country and post index
    new_blog = {
        "id": unique_id,
        "created_at": datetime.now().strftime('%Y-%m-%d'),
        "country": blog_data['country'],
        "country_code": blog_data['country_code'],
        "title": blog_data['title'],
        "folder": f"{serialized_country}/{post_index}",
        "background_image": blog_data['background_image'],
        "path": f"/blog/{serialized_country}/{post_index}",
        "blog_description": blog_data['blog_description']
    }

    if 'state' in blog_data:
        new_blog['state'] = blog_data['state']

    blog_entry = json.dumps(new_blog, indent=2, ensure_ascii=False)
    blog_entry = re.sub(r'(\s+)"([^"]+)":', r'\1\2:', blog_entry)

    blogs_array_end = content.rindex('];')

    # Extract the part before the closing of the array
    content_before_end = content[:blogs_array_end].rstrip()

    # Check whether to add a comma before the new entry
    needs_comma = content_before_end[-1] != '[' and not content_before_end.endswith(',')
    insertion = (',\n  ' if needs_comma else '  ') + blog_entry + ',\n'
    new_content = content[:blogs_array_end] + insertion + content[blogs_array_end:]

    with open(blogs_file, 'w') as f:
        f.write(new_content)

def create_blog_component(blog_component_dir, blog_data, post_index):
    """Create blog component with full functionality."""
    serialized_country = serialize_location(blog_data['country'])
    component_name = create_component_name(blog_data['country'], blog_data.get('state'))
    component_name = f"{component_name}Post{post_index}"
    constants_name = create_constants_name(blog_data['country'], blog_data.get('state'))
    constants_name = f"{constants_name}_POST_{post_index}"

    filename = f"{component_name}.tsx"
    blog_content = blog_data['blog']

    # Create blog path for ImageGrid
    blog_path = f"{serialized_country}/{post_index}"

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
        return <ImageGrid images={{section.images || []}} blogPath="{blog_path}" />;
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
            <div
              className="post-bolded-text post-tips-section-container"
              dangerouslySetInnerHTML={{{{ __html: {constants_name}.tipsSection }}}}
            />
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
    serialized_country = serialize_location(blog_data['country'])
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
            'content': section.get('content'),
        }

        # Add optional fields
        if 'images' in section:
            section_obj['images'] = section['images']
        if 'left_image' in section:
            section_obj['leftImage'] = section['left_image']
        if 'right_image' in section:
            section_obj['rightImage'] = section['right_image']

        content_sections.append(section_obj)

    # Convert itineraries
    itineraries = blog_content.get('itineraries', [])

    # Create the variable name for the content object
    content_var_name = f"{serialize_location(blog_data['country']).replace('-', '')}Content"

    # Properly format the description and other text fields
    description = blog_content['description'].replace('`', '\\`').replace('${', '\\${')
    tips_section = blog_content.get('tips_section', '').replace('`', '\\`').replace('${', '\\${')

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
  backgroundImage: content.backgroundImage,
  itineraries: content.itineraries || [],
  content: content.content || [],
}});

// Specific content for {blog_data['country']} post
const {content_var_name}: BlogPostContent = {{
  country: "{blog_data['country']}",
  path: "{serialized_country}/{post_index}",
  header: "{blog_content['header']}",
  title: "{blog_data['title']}",
  subtitle: "{blog_content['subtitle']}",
  backgroundImage: "{blog_data['background_image']}",
  description: `{description}`,
  tipsSection: "{tips_section}",
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
        converted["leftType"] = layout.get("left_type", "text")
        converted["rightType"] = layout.get("right_type", "text")
        if "image_alt" in layout:
            converted["imageAlt"] = layout["image_alt"]

    return converted

def update_app_js(base_dir, blog_data, post_index):
    """Update App.js with the new blog route."""
    app_file = base_dir / "src/App.js"
    serialized_country = serialize_location(blog_data['country'])
    component_name = create_component_name(blog_data['country'], blog_data.get('state'))
    component_name = f"{component_name}Post{post_index}"
    file_extension = ".tsx"

    with open(app_file, 'r') as f:
        content = f.read()

    # Add import statement after the last import
    import_line = f"import {component_name} from './pages/BlogPage/Blogs/{serialized_country}/{post_index}/{component_name}{file_extension}';\n"
    last_import_index = content.rindex('import')
    last_import_line_end = content.find('\n', last_import_index) + 1
    content = content[:last_import_line_end] + import_line + content[last_import_line_end:]

    switch_case = f'''    case "{serialized_country}":
      if (index === "{post_index}") {{
        return <{component_name} />;
      }}
      break;\n'''

    switch_index = content.find('switch (postName) {')
    default_case_index = content.find('default:', switch_index)

    # If this is the first case for this country, add the whole case
    # If the country case exists, add just the if statement
    country_case_index = content.find(f'case "{serialized_country}":', switch_index, default_case_index)

    if country_case_index == -1:
        # Country doesn't exist yet, add new case before default
        content = content[:default_case_index] + switch_case + content[default_case_index:]
    else:
        # Country exists, find the break statement and add before it
        break_index = content.find('break;', country_case_index)
        if_statement = f'''      if (index === "{post_index}") {{
        return <{component_name} />;
      }}\n'''
        content = content[:break_index] + if_statement + content[break_index:]

    with open(app_file, 'w') as f:
        f.write(content)