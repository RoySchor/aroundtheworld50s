"""Gallery management module for home page rotating gallery."""
import os
import shutil
import sys
from pathlib import Path
import subprocess
import json

# Add scripts directory to path for imports
scripts_dir = Path(__file__).parent.parent
sys.path.insert(0, str(scripts_dir))

from cloudinary_utils import configure_cloudinary, upload_gallery_image, delete_gallery_image

class GalleryManager:
    """Main class for managing home page gallery operations."""

    def __init__(self):
        self.base_dir = Path.cwd()
        self.gallery_dir = self.base_dir / "src/assets/homePageGallery"  # Legacy, not used for Cloudinary
        self.desktop_path = Path.home() / "Desktop"

    def get_current_images(self):
        """Get list of current images in the gallery from Cloudinary."""
        if not configure_cloudinary():
            print("❌ Failed to configure Cloudinary. Check your credentials.")
            return []

        try:
            import cloudinary.api
            # List all resources with the homePageGallery tag
            result = cloudinary.api.resources_by_tag(
                "homePageGallery",
                resource_type="image",
                max_results=100
            )

            images = []
            for resource in result.get('resources', []):
                images.append({
                    'name': resource['public_id'].split('/')[-1],
                    'public_id': resource['public_id'],
                    'url': resource['secure_url'],
                    'size': resource.get('bytes', 0)
                })

            return sorted(images, key=lambda x: x['name'])
        except Exception as e:
            print(f"❌ Failed to fetch images from Cloudinary: {e}")
            return []

    def add_images(self, image_files):
        """Add new images to the gallery by uploading to Cloudinary."""
        if not configure_cloudinary():
            print("❌ Failed to configure Cloudinary. Check your credentials.")
            return []

        added_images = []

        for image_file in image_files:
            source_path = Path(image_file)
            if not source_path.exists():
                print(f"Warning: Image file not found: {image_file}")
                continue

            # Upload to Cloudinary
            url = upload_gallery_image(source_path, source_path.name)
            if url:
                added_images.append(source_path.name)

        return added_images

    def remove_images(self, image_names):
        """Remove images from the gallery by deleting from Cloudinary."""
        if not configure_cloudinary():
            print("❌ Failed to configure Cloudinary. Check your credentials.")
            return []

        removed_images = []

        for image_name in image_names:
            if delete_gallery_image(image_name):
                removed_images.append(image_name)
            else:
                print(f"Warning: Could not remove image: {image_name}")

        return removed_images

    def run_lint_fix(self):
        """Run npm run lint:fix to fix any linting issues."""
        print("\n🔍 Running npm run lint:fix...")
        try:
            subprocess.run(['npm', 'run', 'lint:fix'], cwd=self.base_dir, check=True)
            print("✅ Linting completed successfully!")
            return True
        except subprocess.CalledProcessError as e:
            print(f"⚠️ Warning: Linting failed with error: {e}")
            return False

    def start_dev_server(self):
        """Start the development server."""
        print("\n🌐 Starting development server...")
        try:
            if sys.platform == "darwin":  # macOS
                script_path = self.base_dir / "start_dev_server.sh"
                # Make sure the script is executable
                subprocess.run(['chmod', '+x', str(script_path)], check=True)
                # Open in new Terminal window with relative path
                subprocess.run(['open', '-a', 'Terminal', './start_dev_server.sh'], cwd=self.base_dir, check=True)
            elif sys.platform == "win32":  # Windows
                subprocess.run(['start', 'cmd', '/k', 'npm', 'start'], cwd=self.base_dir, check=True)
            else:  # Linux
                subprocess.run(['gnome-terminal', '--', 'npm', 'start'], cwd=self.base_dir, check=True)

            print("✅ Development server started!")
            return True
        except subprocess.CalledProcessError as e:
            print(f"⚠️ Failed to start development server: {e}")
            return False

    def kill_npm_process(self):
        """Kill any running npm start process."""
        try:
            if sys.platform == "darwin":  # macOS
                subprocess.run(['pkill', '-f', 'node.*npm start'], check=False)
                subprocess.run(['pkill', '-f', 'node.*react-scripts start'], check=False)
            elif sys.platform == "win32":  # Windows
                subprocess.run(['taskkill', '/F', '/IM', 'node.exe'], check=False)
            else:  # Linux
                subprocess.run(['pkill', '-f', 'node.*npm start'], check=False)
        except subprocess.CalledProcessError:
            pass

    def commit_and_deploy(self):
        """Commit changes and deploy."""
        print("\n🚀 Committing and deploying changes...")
        try:
            # Add all changes
            subprocess.run(['git', 'add', '.'], cwd=self.base_dir, check=True)

            # Commit changes
            subprocess.run(['git', 'commit', '-m', 'Update home page gallery images'],
                         cwd=self.base_dir, check=True)

            # Push changes
            subprocess.run(['git', 'push'], cwd=self.base_dir, check=True)

            # Deploy
            subprocess.run(['npm', 'run', 'deploy'], cwd=self.base_dir, check=True)

            print("✅ Changes deployed successfully!")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Deployment failed: {e}")
            return False

    def revert_changes(self):
        """Revert all changes."""
        print("\n↩️ Reverting all changes...")
        self.kill_npm_process()

        try:
            # Get current commit hash
            result = subprocess.run(['git', 'rev-parse', 'HEAD'],
                                  cwd=self.base_dir, capture_output=True, text=True, check=True)
            current_commit = result.stdout.strip()

            # Reset to current commit
            subprocess.run(['git', 'reset', '--hard', current_commit], cwd=self.base_dir, check=True)

            # Clean untracked files
            subprocess.run(['git', 'clean', '-fd'], cwd=self.base_dir, check=True)

            print("✅ All changes reverted successfully!")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to revert changes: {e}")
            return False

    def find_image_files(self, image_names, folder_name=None):
        """Find image files on desktop or in specified desktop folder.

        Args:
            image_names: List of image filenames to find
            folder_name: Optional folder name on desktop containing images

        Returns:
            tuple: (found_files, missing_files)
        """
        found_files = []
        missing_files = []

        # Determine search path
        if folder_name:
            search_path = self.desktop_path / folder_name
            if not search_path.exists() or not search_path.is_dir():
                print(f"❌ Error: Folder '{folder_name}' not found on Desktop")
                print(f"Expected location: {search_path}")
                return [], image_names
        else:
            search_path = self.desktop_path

        print(f"\n🔍 Looking for images in: {search_path}")

        for image_name in image_names:
            image_path = search_path / image_name
            if image_path.exists() and image_path.is_file():
                found_files.append(str(image_path))
            else:
                missing_files.append(image_name)

        # Print summary
        if found_files:
            print(f"✅ Found {len(found_files)} image(s)")
        if missing_files:
            print(f"❌ Could not find {len(missing_files)} image(s):")
            for missing in missing_files:
                print(f"   • {missing}")

        return found_files, missing_files

    def update_gallery(self, changes_data):
        """Main method to update the gallery with given changes."""
        print("🖼️ Starting gallery update process...")
        print("☁️ Images are stored in Cloudinary (no local files)")

        # Extract data
        add_images = changes_data.get('add_images', [])
        remove_images_list = changes_data.get('remove_images', [])
        folder_name = changes_data.get('folder_name', None)  # Optional folder name on desktop

        print(f"📋 Changes to apply:")
        if add_images:
            print(f"  ➕ Add {len(add_images)} images: {', '.join(add_images)}")
        if remove_images_list:
            print(f"  ➖ Remove {len(remove_images_list)} images: {', '.join(remove_images_list)}")
        if folder_name:
            print(f"  📁 Looking in Desktop folder: {folder_name}")
        else:
            print("  📁 Looking directly on Desktop")

        # Kill any existing npm processes
        self.kill_npm_process()

        try:
            # Process additions
            if add_images:
                found_files, missing_files = self.find_image_files(add_images, folder_name)

                if missing_files:
                    print("\n❌ Aborting due to missing files on desktop")
                    return False

                print(f"\n➕ Uploading {len(found_files)} new images to Cloudinary...")
                added = self.add_images(found_files)
                if not added:
                    print("❌ Failed to upload images to Cloudinary")
                    return False

            # Process removals
            if remove_images_list:
                print(f"\n➖ Removing {len(remove_images_list)} images from Cloudinary...")
                self.remove_images(remove_images_list)

            # Start development server for preview
            self.start_dev_server()

            print("\n✨ Gallery update completed!")
            print("🌐 Please check http://localhost:3000 to review changes")
            print("ℹ️ Note: Changes are already live in Cloudinary!")

            # Interactive confirmation
            self.interactive_confirmation()

            return True

        except Exception as e:
            print(f"❌ Gallery update failed: {e}")
            return False

    def interactive_confirmation(self):
        """Interactive confirmation after Cloudinary changes (already live)."""
        print("\n" + "="*50)
        print("🔍 REVIEW YOUR CHANGES")
        print("="*50)
        print("Please review the gallery at: http://localhost:3000")
        print("Navigate to the home page and check the rotating gallery.")
        print("")
        print("⚠️ Note: Changes are already live in Cloudinary!")
        print("If you need to revert, you'll need to re-upload/delete manually.")
        print("="*50)

        try:
            input("\nPress Enter when done reviewing...")
            print("\n✅ Review complete!")

        finally:
            # Always kill the development server when done
            print("\n🔄 Cleaning up development server...")
            self.kill_npm_process()
            print("✅ Development server stopped")

def main():
    """Command line interface for gallery management."""
    if len(sys.argv) < 2:
        print("Usage: python gallery_manager.py <command> [args]")
        print("Commands:")
        print("  list - List current gallery images")
        print("  add <image_paths> - Add images to gallery")
        print("  remove <image_names> - Remove images from gallery")
        print("  update <changes_json> - Update gallery with JSON changes")
        return

    manager = GalleryManager()
    command = sys.argv[1]

    if command == "list":
        images = manager.get_current_images()
        print(f"📸 Current gallery has {len(images)} images:")
        for img in images:
            size_mb = img['size'] / (1024 * 1024)
            print(f"  • {img['name']} ({size_mb:.1f} MB)")

    elif command == "add":
        if len(sys.argv) < 3:
            print("Please provide image file paths to add")
            return
        image_files = sys.argv[2:]
        manager.add_images(image_files)

    elif command == "remove":
        if len(sys.argv) < 3:
            print("Please provide image names to remove")
            return
        image_names = sys.argv[2:]
        manager.remove_images(image_names)

    elif command == "update":
        if len(sys.argv) < 3:
            print("Please provide changes JSON")
            return
        changes_json = sys.argv[2]
        try:
            changes_data = json.loads(changes_json)
            manager.update_gallery(changes_data)
        except json.JSONDecodeError:
            print("Invalid JSON format")

    else:
        print(f"Unknown command: {command}")

if __name__ == "__main__":
    main()