"""File operations for blog management."""
from pathlib import Path
import shutil
import json
import re
import sys
from datetime import datetime
from .utils import serialize_location

def setup_directories(base_dir, country_name, post_index):
    """Create necessary directories for assets and data."""
    serialized_country = serialize_location(country_name)

    # Create directories
    assets_dir = base_dir / "src/assets/blog" / serialized_country / str(post_index)
    blog_component_dir = base_dir / "src/pages/BlogPage/Blogs" / serialized_country / str(post_index)

    for directory in [assets_dir, data_dir, blog_component_dir]:
        directory.mkdir(parents=True, exist_ok=True)

    return assets_dir, data_dir, blog_component_dir

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

    # Convert to string and remove quotes only from keys
    blog_entry = json.dumps(new_blog, indent=2, ensure_ascii=False)
    # Remove quotes from keys but keep them for values
    blog_entry = re.sub(r'(\s+)"([^"]+)":', r'\1\2:', blog_entry)

    # Insert new blog entry
    blogs_array_end = content.rindex('];')
    new_content = content[:blogs_array_end] + blog_entry + content[blogs_array_end:]

    # Write updated content
    with open(blogs_file, 'w') as f:
        f.write(new_content)

def create_blog_component(blog_component_dir, blog_data, post_index):
    """Create a new blog component file."""
    serialized_country = serialize_location(blog_data['country'])

    # Create component name with state if provided
    component_name = serialized_country.replace("-", "").title()
    if 'state' in blog_data:
        state_name = serialize_location(blog_data['state']).replace("-", "").title()
        component_name = f"{component_name}{state_name}"
    component_name = f"{component_name}Post{post_index}"

    # Create filename
    filename = f"{component_name}.js"

    component_content = f'''
      import React from "react";
      import "../../../../../styles/layout.css";
      import "../../BlogPost.css";
      import background from "../../../../../assets/blog/{serialized_country}/{post_index}/{blog_data['background_image']}";

      const {component_name} = () => {{
        return (
          <div className="page-container">
            <div
              className="fixed-background-container"
              style={{{{
                backgroundImage: `url(${{background}})`,
              }}}}
            >
              <div className="fixed-background-text-container">
                <div className="fixed-background-title fixed-background-no-margin">
                  {blog_data['title']}
                </div>
              </div>
            </div>

            <div className="container">
              <div className="page-content">
              </div>
            </div>
          </div>
        );
      }};

      export default {component_name};
    '''

    with open(blog_component_dir / filename, 'w') as f:
        f.write(component_content)

def update_app_js(base_dir, blog_data, post_index):
    """Update App.js with the new blog route."""
    app_file = base_dir / "src/App.js"
    serialized_country = serialize_location(blog_data['country'])
    component_name = f"{serialized_country.replace('-', '').title()}Post{post_index}"

    with open(app_file, 'r') as f:
        content = f.read()

    # Add import statement after the last import
    import_line = f"import {component_name} from './pages/BlogPage/Blogs/{serialized_country}/{post_index}';\n"
    last_import_index = content.rindex('import')
    last_import_line_end = content.find('\n', last_import_index) + 1
    content = content[:last_import_line_end] + import_line + content[last_import_line_end:]

    # Add case to switch statement in BlogPost function
    switch_case = f'''    case "{serialized_country}":
      if (index === "{post_index}") {{
        return <{component_name} />;
      }}
      break;\n'''

    # Find the switch statement
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