"""Gallery management module for home page rotating gallery."""
import os
import shutil
import sys
from pathlib import Path
import subprocess
import json

class GalleryManager:
    """Main class for managing home page gallery operations."""

    def __init__(self):
        self.base_dir = Path.cwd()
        self.gallery_dir = self.base_dir / "src/assets/homePageGallery"

    def get_current_images(self):
        """Get list of current images in the gallery."""
        if not self.gallery_dir.exists():
            return []

        supported_formats = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
        images = []

        for file in self.gallery_dir.iterdir():
            if file.is_file() and file.suffix.lower() in supported_formats:
                images.append({
                    'name': file.name,
                    'path': str(file),
                    'size': file.stat().st_size
                })

        return sorted(images, key=lambda x: x['name'])

    def add_images(self, image_files):
        """Add new images to the gallery."""
        if not self.gallery_dir.exists():
            self.gallery_dir.mkdir(parents=True, exist_ok=True)

        added_images = []

        for image_file in image_files:
            source_path = Path(image_file)
            if not source_path.exists():
                print(f"Warning: Image file not found: {image_file}")
                continue

            # Copy image to gallery directory
            dest_path = self.gallery_dir / source_path.name

            # Handle naming conflicts
            counter = 1
            while dest_path.exists():
                name_parts = source_path.stem, counter, source_path.suffix
                dest_path = self.gallery_dir / f"{name_parts[0]}_{name_parts[1]}{name_parts[2]}"
                counter += 1

            shutil.copy2(source_path, dest_path)
            added_images.append(dest_path.name)
            print(f"✅ Added: {dest_path.name}")

        return added_images

    def remove_images(self, image_names):
        """Remove images from the gallery."""
        removed_images = []

        for image_name in image_names:
            image_path = self.gallery_dir / image_name
            if image_path.exists():
                image_path.unlink()
                removed_images.append(image_name)
                print(f"❌ Removed: {image_name}")
            else:
                print(f"Warning: Image not found for removal: {image_name}")

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
                with open(script_path, 'w') as f:
                    f.write('#!/bin/bash\n')
                    f.write(f'cd "{self.base_dir}"\n')
                    f.write('npm start\n')
                subprocess.run(['chmod', '+x', str(script_path)], check=True)
                subprocess.run(['open', '-a', 'Terminal', str(script_path)], check=True)
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

    def update_gallery(self, changes_data):
        """Main method to update the gallery with given changes."""
        print("🖼️ Starting gallery update process...")

        # Kill any existing npm processes
        self.kill_npm_process()

        try:
            # Process additions
            if 'add_images' in changes_data and changes_data['add_images']:
                print(f"\n➕ Adding {len(changes_data['add_images'])} new images...")
                self.add_images(changes_data['add_images'])

            # Process removals
            if 'remove_images' in changes_data and changes_data['remove_images']:
                print(f"\n➖ Removing {len(changes_data['remove_images'])} images...")
                self.remove_images(changes_data['remove_images'])

            # Run linting
            self.run_lint_fix()

            # Start development server for preview
            self.start_dev_server()

            print("\n✨ Gallery update completed!")
            print("🌐 Please check http://localhost:3000 to review changes")
            print("📋 Use approve_changes() or revert_changes() based on your review")

            return True

        except Exception as e:
            print(f"❌ Gallery update failed: {e}")
            self.revert_changes()
            return False

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