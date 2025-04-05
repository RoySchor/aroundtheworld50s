"""Main blog management module."""
import json
import sys
from pathlib import Path
from .utils import get_desktop_path, validate_json, get_next_post_index
from .file_operations import (
    setup_directories,
    copy_images,
    update_blogs_js,
    create_blog_component,
    update_app_js
)
from .process_management import (
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

        # Get the source folder name
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

        # Kill any existing npm processes first
        kill_npm_process()

        # Setup directories
        post_index = get_next_post_index(self.base_dir / "src/assets/blog" / blog_data['country'])
        assets_dir, data_dir, blog_component_dir = setup_directories(self.base_dir, blog_data['country'], post_index)

        # Copy images
        copy_images(source_dir, assets_dir, blog_data['background_image'])

        # Update blogs.js
        update_blogs_js(self.base_dir, blog_data, post_index)

        # Create blog component
        create_blog_component(blog_component_dir, blog_data, post_index)

        # Update App.js with new route
        update_app_js(self.base_dir, blog_data, post_index)

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
            # Revert all changes
            revert_changes(self.base_dir, assets_dir, blog_component_dir, blog_data, post_index)
            print("\nAll changes have been reverted. You can try again with different content.")
        else:
            # Deploy changes
            deploy_changes(self.base_dir)
            print("\n✨ Blog post has been successfully added and deployed! ✨")
            print("\nYou can now remove the folder from your Desktop if you want!")

        # Kill npm process at the end
        kill_npm_process()

def main():
    """Entry point for the script."""
    manager = BlogManager()
    manager.add_blog()

if __name__ == "__main__":
    main()