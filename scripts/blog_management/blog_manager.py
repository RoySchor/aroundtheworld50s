"""Main blog management module."""
import json
import sys
from datetime import datetime
from pathlib import Path
from utils import (
    get_desktop_path,
    validate_json,
    get_next_post_index,
    is_us_country,
    serialize_location
)
from file_operations import (
    setup_directories,
    copy_images,
    update_blogs_js,
    create_blog_types,
    create_blog_constants,
    create_blog_component,
    update_app_js
)
from process_management import (
    run_lint_fix,
    run_npm_start,
    kill_npm_process,
    revert_changes,
    deploy_changes,
    force_webpack_rebuild,
    clear_webpack_cache
)

class BlogManager:
    """Main class for managing blog operations."""

    def __init__(self):
        self.base_dir = Path.cwd()
        self.desktop_path = get_desktop_path()

    def add_blog(self):
        """Main function to add a new blog post."""
        print("Welcome to the blog addition tool!")
        print(f"\nLooking for blog folders on your Desktop: {self.desktop_path}")

        # First, try to auto-detect blog folders with pattern {country}-blog
        blog_folders = []
        for item in self.desktop_path.iterdir():
            if item.is_dir() and item.name.endswith('-blog'):
                # Check if it contains a JSON file
                json_files = list(item.glob("*.json"))
                if json_files:
                    blog_folders.append(item.name)

        if len(blog_folders) == 1:
            # Auto-detected single blog folder
            folder_name = blog_folders[0]
            print(f"✅ Auto-detected blog folder: {folder_name}")
            source_dir = self.desktop_path / folder_name
        elif len(blog_folders) > 1:
            # Multiple blog folders found, let user choose
            print(f"\n📁 Found multiple blog folders:")
            for i, folder in enumerate(blog_folders, 1):
                print(f"  {i}. {folder}")

            while True:
                try:
                    choice = input(f"\nEnter the number (1-{len(blog_folders)}): ").strip()
                    folder_index = int(choice) - 1
                    if 0 <= folder_index < len(blog_folders):
                        folder_name = blog_folders[folder_index]
                        source_dir = self.desktop_path / folder_name
                        break
                    else:
                        print(f"Please enter a number between 1 and {len(blog_folders)}")
                except ValueError:
                    print("Please enter a valid number")
        else:
            # No auto-detected folders, fall back to manual input
            folder_name = input("\nPlease enter the name of your blog folder (it should be on your Desktop): ").strip()
        source_dir = self.desktop_path / folder_name

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

        print("✨ Generating rich blog post with full content structure...")

        # Kill any existing npm processes first
        kill_npm_process()

        # Setup directories
        # Determine the correct path for post index calculation
        if blog_data.get('state') and is_us_country(blog_data['country'], blog_data['country_code']):
            # For US states, use state-specific path
            location_path = f"united-states-{serialize_location(blog_data['state'])}"
        else:
            location_path = blog_data['country']

        # Get the next post index first (check blog components dir since assets are now on Cloudinary)
        post_index = get_next_post_index(self.base_dir / "src/pages/BlogPage/Blogs" / serialize_location(location_path))
        print(f"\n📝 Creating blog post {post_index} for {location_path}")

        # Then setup directories with the correct index
        blog_path, blog_component_dir = setup_directories(
            self.base_dir,
            blog_data['country'],
            post_index,
            blog_data.get('state')  # Pass state if present
        )

        # Upload images to Cloudinary
        copy_images(source_dir, blog_path, blog_data['background_image'])

        # Update blogs.js
        update_blogs_js(self.base_dir, blog_data, post_index)

        # Create blog components
        create_blog_types(blog_component_dir, blog_data, post_index)
        create_blog_constants(blog_component_dir, blog_data, post_index)
        create_blog_component(blog_component_dir, blog_data, post_index)

        # Update App.js with new route
        update_app_js(self.base_dir, blog_data, post_index)

        # Handle tips page creation if blog has tips section
        print("\n🔍 Checking for tips section...")
        print(f"Tips in blog object: {blog_data.get('blog', {}).get('tips_section')}")
        print(f"Tips at root level: {blog_data.get('tipsSection')}")
        if blog_data.get('blog', {}).get('tips_section') or blog_data.get('tipsSection'):
            print("✅ Found tips section, creating tips page...")
            self.handle_tips_page(blog_data)
        else:
            print("❌ No tips section found in blog data")

        # Run lint:fix
        run_lint_fix(self.base_dir)

        # Clear webpack cache and force rebuild
        clear_webpack_cache(self.base_dir)
        force_webpack_rebuild(self.base_dir)

        # Start new development server
        run_npm_start(self.base_dir)

        # Ask for confirmation
        while True:
            response = input("\nDoes the blog post look good? (yes/no): ").strip().lower()
            if response in ['yes', 'no']:
                break
            print("Please answer 'yes' or 'no'")

        if response == 'no':
            # Revert all changes (blog_path passed for compatibility, images on Cloudinary need manual cleanup)
            revert_changes(self.base_dir, blog_path, blog_component_dir, blog_data, post_index)
            print("\nAll changes have been reverted. You can try again with different content.")
        else:
            # Deploy changes
            deploy_changes(self.base_dir, blog_data)
            print("\n✨ Blog post has been successfully added and deployed! ✨")
            print("\nYou can now remove the folder from your Desktop if you want!")

        # Kill npm process at the end
        kill_npm_process()

    def handle_tips_page(self, blog_data):
        """Create or update tips page for the blog's location."""
        print("\n🎯 Processing tips page...")

        country = blog_data['country']
        state = blog_data.get('state')
        country_code = blog_data.get('country_code')

        # Generate tips path based on location
        if state and country_code == 'US':
            # For US states: united-states-california
            tips_path = f"united-states-{serialize_location(state)}"
            location_display = f"{country}, {state}"
        else:
            # For countries: trinidad-and-tobago
            tips_path = serialize_location(country)
            location_display = country

        # Read current tips.js file
        tips_file = self.base_dir / "src/data/tips.js"

        try:
            with open(tips_file, 'r', encoding='utf-8') as f:
                tips_content = f.read()

            # Check if this tips entry already exists
            if f'path: "{tips_path}"' in tips_content:
                print(f"✅ Tips page for {location_display} already exists")
                return

            # Extract existing tips array
            start_marker = "const tips = ["
            end_marker = "];"

            start_idx = tips_content.find(start_marker)
            end_idx = tips_content.find(end_marker, start_idx)

            if start_idx == -1 or end_idx == -1:
                print("⚠️  Could not parse tips.js file")
                return

            # Get existing tips entries
            existing_tips = tips_content[start_idx + len(start_marker):end_idx].strip()

            # Generate new tip entry
            new_tip_entry = f"""  {{
    id: {self.get_next_tip_id(tips_content)},
    country: "{country}",
    country_code: "{country_code}",
    state: {f'"{state}"' if state else 'null'},
    path: "{tips_path}",
    title: "{location_display} Travel Tips",
    description: "Essential tips for traveling in {location_display}",
    created_at: new Date("{datetime.now().strftime('%Y-%m-%d')}"),
  }}"""

            # Add comma if there are existing tips
            if existing_tips and not existing_tips.endswith(','):
                existing_tips += ','

            # Build new tips content
            new_tips_content = f"""{tips_content[:start_idx]}{start_marker}
{existing_tips}
{new_tip_entry},
{tips_content[end_idx:]}"""

            # Write updated tips.js
            with open(tips_file, 'w', encoding='utf-8') as f:
                f.write(new_tips_content)

            print(f"✅ Created tips page entry for {location_display}")

            # Create initial tips content file
            tips_content_dir = self.base_dir / "src/data/tipsContent"
            tips_content_dir.mkdir(parents=True, exist_ok=True)

            tips_content_file = tips_content_dir / f"{tips_path}.json"
            initial_content = {
                "tip": {
                    "country": country,
                    "country_code": country_code,
                    "state": state,
                    "path": tips_path,
                    "title": f"{location_display} Travel Tips",
                    "description": f"Essential tips for traveling in {location_display}"
                },
                "content": {
                    "essentialTips": "default content",
                    "budgetPlanning": "default content",
                    "foodDining": "default content",
                    "transportation": "default content",
                    "accommodation": "default content",
                    "safetyHealth": "default content"
                }
            }

            with open(tips_content_file, 'w', encoding='utf-8') as f:
                json.dump(initial_content, f, indent=2)

            print(f"✅ Created initial tips content file at {tips_content_file}")

        except Exception as e:
            print(f"⚠️  Error updating tips page: {str(e)}")

    def get_next_tip_id(self, tips_content):
        """Get the next available tip ID."""
        import re

        # Find all existing IDs
        id_matches = re.findall(r'id:\s*(\d+)', tips_content)
        if not id_matches:
            return 1

        # Return the highest ID + 1
        return max(int(id_str) for id_str in id_matches) + 1

def main():
    """Entry point for the script."""
    manager = BlogManager()
    manager.add_blog()

if __name__ == "__main__":
    main()