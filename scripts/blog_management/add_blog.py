#!/usr/bin/env python3
import json
import os
import shutil
import sys
from datetime import datetime
from pathlib import Path
import re
import subprocess

REQUIRED_FIELDS = {
    "country": "Country name",
    "country_code": "Two letter country code",
    "title": "Blog post title",
    "background_image": "Main background image filename",
    "blog_description": "Short blog description"
}

def get_desktop_path():
    """Get the path to the user's Desktop directory."""
    return Path.home() / "Desktop"

def serialize_location(name):
    """Convert a location name to URL-friendly format."""
    return name.lower().replace(" ", "-").replace("&", "and")

def get_next_post_index(country_path):
    """Get the next available post index for a country."""
    if not country_path.exists():
        return 1

    existing_indices = [int(p.name) for p in country_path.iterdir() if p.name.isdigit()]
    return max(existing_indices, default=0) + 1

def validate_json(json_data):
    """Validate that all required fields are present in the JSON."""
    missing_fields = []
    for field, description in REQUIRED_FIELDS.items():
        if field not in json_data:
            missing_fields.append(f"{field} ({description})")

    if missing_fields:
        print("Error: Missing required fields:")
        for field in missing_fields:
            print(f"- {field}")
        sys.exit(1)

def setup_directories(base_dir, country_name, post_index):
    """Create necessary directories for assets and data."""
    serialized_country = serialize_location(country_name)

    # Create directories
    assets_dir = base_dir / "src/assets/blog" / serialized_country / str(post_index)
    data_dir = base_dir / "src/data" / serialized_country
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

    # Create new blog entry
    serialized_country = serialize_location(blog_data['country'])
    new_blog = {
        "id": post_index,
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
    component_content = f'''import React from "react";
import "../../../../../styles/layout.css";
import "../../BlogPost.css";
import background from "../../../../../assets/blog/{serialized_country}/{post_index}/{blog_data['background_image']}";

const {serialized_country.replace("-", "").title()}Post{post_index} = () => {{
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

export default {serialized_country.replace("-", "").title()}Post{post_index};
'''

    with open(blog_component_dir / "index.js", 'w') as f:
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

def run_lint_fix(base_dir):
    """Run npm run lint:fix to fix any linting issues."""
    print("\nRunning npm run lint:fix to fix any formatting issues...")
    try:
        subprocess.run(['npm', 'run', 'lint:fix'], cwd=base_dir, check=True)
        print("✅ Linting completed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"⚠️ Warning: Linting failed with error: {e}")
        print("You may want to run 'npm run lint:fix' manually to fix any issues")

def run_npm_start(base_dir):
    """Run npm start in a new terminal window."""
    print("\nStarting the development server in a new window...")
    try:
        if sys.platform == "darwin":  # macOS
            # Create a shell script to run npm start
            script_path = base_dir / "start_dev_server.sh"
            with open(script_path, 'w') as f:
                f.write('#!/bin/bash\n')
                f.write(f'cd "{base_dir}"\n')
                f.write('npm start\n')
            # Make the script executable
            subprocess.run(['chmod', '+x', str(script_path)], check=True)
            # Open in new Terminal window
            subprocess.run(['open', '-a', 'Terminal', str(script_path)], check=True)
        elif sys.platform == "win32":  # Windows
            subprocess.run(['start', 'cmd', '/k', 'npm', 'start'], cwd=base_dir, check=True)
        else:  # Linux
            subprocess.run(['gnome-terminal', '--', 'npm', 'start'], cwd=base_dir, check=True)
        print("✅ Development server started in a new window!")
        print("Please check the new terminal window for the development server.")
    except subprocess.CalledProcessError as e:
        print(f"⚠️ Warning: Failed to start development server: {e}")
        print("You may need to start it manually with 'npm start' in a new terminal")

def kill_npm_process():
    """Kill any running npm start process."""
    try:
        if sys.platform == "darwin":  # macOS
            subprocess.run(['pkill', '-f', 'npm start'], check=False)
        elif sys.platform == "win32":  # Windows
            subprocess.run(['taskkill', '/F', '/IM', 'node.exe'], check=False)
        else:  # Linux
            subprocess.run(['pkill', '-f', 'npm start'], check=False)
    except subprocess.CalledProcessError:
        pass  # Ignore errors if no process is running

def revert_changes(base_dir, assets_dir, blog_component_dir, blog_data, post_index):
    """Revert all changes made by the script."""
    print("\nReverting all changes...")

    # Kill npm start process
    kill_npm_process()

    try:
        # Get the current commit hash
        result = subprocess.run(['git', 'rev-parse', 'HEAD'], cwd=base_dir, capture_output=True, text=True, check=True)
        current_commit = result.stdout.strip()

        # Reset to the current commit, discarding all changes
        subprocess.run(['git', 'reset', '--hard', current_commit], cwd=base_dir, check=True)
        print("✅ All changes have been reverted to the last commit!")
    except subprocess.CalledProcessError as e:
        print(f"⚠️ Error reverting changes: {e}")
        print("You may need to revert changes manually with 'git reset --hard HEAD'")

def deploy_changes(base_dir):
    """Commit, push, and deploy the changes."""
    print("\nDeploying changes...")
    try:
        # Commit changes
        subprocess.run(['git', 'add', '.'], cwd=base_dir, check=True)
        subprocess.run(['git', 'commit', '-m', 'Add new blog post'], cwd=base_dir, check=True)
        # Push changes
        subprocess.run(['git', 'push'], cwd=base_dir, check=True)
        # Deploy
        subprocess.run(['npm', 'run', 'deploy'], cwd=base_dir, check=True)
        print("✅ Changes have been deployed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"⚠️ Error during deployment: {e}")
        print("You may need to deploy manually")

def main():
    print("Welcome to the blog addition tool!")

    # Get the Desktop path
    desktop_path = get_desktop_path()
    print(f"\nLooking for blog folders on your Desktop: {desktop_path}")

    # Get the source folder name
    folder_name = input("\nPlease enter the name of your blog folder (it should be on your Desktop): ").strip()
    source_dir = desktop_path / folder_name

    if not source_dir.exists():
        print(f"\nError: Folder '{folder_name}' not found on your Desktop")
        print(f"Make sure the folder is located at: {source_dir}")
        sys.exit(1)

    # Find and load the JSON file
    json_files = list(source_dir.glob("*.json"))
    if not json_files:
        print("\nError: No JSON file found in the folder")
        print("Make sure you have a file ending in .json in your folder")
        print("You can copy the template from: scripts/blog_management/blog_template.json")
        sys.exit(1)

    with open(json_files[0], 'r', encoding='utf-8') as f:
        try:
            blog_data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"\nError: Your JSON file is not formatted correctly")
            print(f"Error details: {str(e)}")
            print("\nMake sure your JSON file follows the template format")
            sys.exit(1)

    # Validate JSON data
    validate_json(blog_data)

    # Setup directories
    base_dir = Path.cwd()
    post_index = get_next_post_index(base_dir / "src/assets/blog" / serialize_location(blog_data['country']))
    assets_dir, data_dir, blog_component_dir = setup_directories(base_dir, blog_data['country'], post_index)

    # Copy images
    copy_images(source_dir, assets_dir, blog_data['background_image'])

    # Update blogs.js
    update_blogs_js(base_dir, blog_data, post_index)

    # Create blog component
    create_blog_component(blog_component_dir, blog_data, post_index)

    # Update App.js with new route
    update_app_js(base_dir, blog_data, post_index)

    # Run lint:fix
    run_lint_fix(base_dir)

    # Start development server
    run_npm_start(base_dir)

    # Ask for confirmation
    while True:
        response = input("\nDoes the blog post look good? (yes/no): ").strip().lower()
        if response in ['yes', 'no']:
            break
        print("Please answer 'yes' or 'no'")

    if response == 'no':
        # Revert all changes
        revert_changes(base_dir, assets_dir, blog_component_dir, blog_data, post_index)
        print("\nAll changes have been reverted. You can try again with different content.")
    else:
        # Deploy changes
        deploy_changes(base_dir)
        print("\n✨ Blog post has been successfully added and deployed! ✨")
        print("\nYou can now remove the folder from your Desktop if you want!")

if __name__ == "__main__":
    main()