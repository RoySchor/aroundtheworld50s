#!/usr/bin/env python3
"""
Tips Management System
Handles the complete workflow for saving and deploying tips content
Following the established patterns from blog_manager.py
"""

import json
import os
import sys
import subprocess
import tempfile
import shutil
from pathlib import Path
from datetime import datetime

# Add the parent directory to sys.path to import common modules
parent_dir = Path(__file__).parent.parent / "blog_management"
sys.path.append(str(parent_dir))

from process_management import run_lint_fix, deploy_changes
import file_operations

class TipsManager:
    def __init__(self):
        self.project_root = Path(__file__).parent.parent.parent
        self.tips_content_dir = self.project_root / "src" / "data" / "tipsContent"

        # Ensure tips content directory exists
        self.tips_content_dir.mkdir(parents=True, exist_ok=True)

    def save_tips_content(self, tips_data):
        """
        Complete workflow for saving tips content
        """
        self.tips_data = tips_data  # Store tips_data for use in show_tips_preview
        try:
            print("🚀 Starting Tips Content Save Process...")
            print("=" * 50)

            # Validate tips data
            if not self.validate_tips_data(tips_data):
                return False

            # Create backup commit point
            try:
                # Get the current commit hash for backup
                result = subprocess.run(['git', 'rev-parse', 'HEAD'],
                                     cwd=self.project_root,
                                     capture_output=True,
                                     text=True,
                                     check=True)
                backup_commit = result.stdout.strip()
            except subprocess.CalledProcessError as e:
                print("❌ Failed to create backup commit")
                return False

            # Save tips content file
            file_path = self.save_tips_file(tips_data)
            if not file_path:
                print("❌ Failed to save tips file")
                self.restore_backup(backup_commit)
                return False

            # Run linting
            print("\n🔍 Running ESLint fix...")
            if not run_lint_fix(self.project_root):
                print("❌ Linting failed")
                self.restore_backup(backup_commit)
                return False

            # Show preview and get user approval
            if not self.get_user_approval():
                print("❌ Changes rejected by user")
                self.restore_backup(backup_commit)
                return False

            # Commit and push changes
            commit_message = self.generate_commit_message(tips_data)
            if not deploy_changes(self.project_root, tips_data):
                print("❌ Failed to deploy changes")
                self.restore_backup(backup_commit)
                return False

            print("\n✅ Tips content saved and deployed successfully!")
            print(f"📍 Tips for {tips_data['tip']['title']} are now live!")
            return True

        except Exception as e:
            print(f"❌ Error in tips save process: {e}")
            return False

    def restore_backup(self, commit_hash):
        """Restore to a previous commit"""
        try:
            subprocess.run(['git', 'reset', '--hard', commit_hash],
                         cwd=self.project_root,
                         check=True)
            subprocess.run(['git', 'clean', '-fd'],
                         cwd=self.project_root,
                         check=True)
            print("✅ Changes reverted successfully")
        except subprocess.CalledProcessError as e:
            print(f"⚠️ Warning: Failed to revert changes: {e}")
            print("You may need to revert changes manually")

    def validate_tips_data(self, tips_data):
        """Validate the structure and content of tips data"""
        try:
            # Check required structure
            if 'tip' not in tips_data or 'content' not in tips_data:
                print("❌ Invalid tips data structure")
                return False

            tip_info = tips_data['tip']
            required_fields = ['title', 'country', 'path']

            for field in required_fields:
                if field not in tip_info or not tip_info[field]:
                    print(f"❌ Missing required field: {field}")
                    return False

            # Validate content sections
            content = tips_data['content']
            expected_sections = [
                'essentialTips', 'budgetPlanning', 'foodDining',
                'transportation', 'accommodation', 'safetyHealth'
            ]

            # Check if at least one section has content
            has_content = False
            for section in expected_sections:
                section_data = content.get(section)
                if (
                    section_data
                    and isinstance(section_data, dict)
                    and section_data.get('content')
                    and isinstance(section_data['content'], str)
                    and section_data['content'].strip()
                    and section_data.get('enabled', True)  # Check if section is enabled, default to True
                ):
                    has_content = True
                    break

            if not has_content:
                print("❌ No content found in any enabled section")
                return False

            print("✅ Tips data validation passed")
            return True

        except Exception as e:
            print(f"❌ Validation error: {e}")
            return False

    def format_markdown_text(self, text):
        """Format markdown text to HTML"""
        if not text:
            return ""

        # Split text into lines and apply initial formatting
        lines = text.split("\n")
        result = []
        current_list = []
        in_list = False

        for line in lines:
            line = line.strip()
            if not line:
                if in_list and current_list:
                    result.append(f"<ul>{' '.join(current_list)}</ul>")
                    current_list = []
                    in_list = False
                result.append("<br>")
                continue

            # Split line into text and bullet points
            parts = line.split("•")
            formatted_parts = []

            for i, part in enumerate(parts):
                if not part.strip():
                    continue

                # Format the part
                formatted_part = self.apply_text_formatting(part.strip())

                # If this is a bullet point (has text on both sides)
                if i > 0 and i < len(parts) - 1:
                    current_list.append(f"<li>{formatted_part}</li>")
                    in_list = True
                else:
                    if in_list and current_list:
                        result.append(f"<ul>{' '.join(current_list)}</ul>")
                        current_list = []
                        in_list = False
                    if formatted_part:
                        result.append(f"<p>{formatted_part}</p>")

        # Add any remaining list items
        if in_list and current_list:
            result.append(f"<ul>{' '.join(current_list)}</ul>")

        return " ".join(result)

    def apply_text_formatting(self, text):
        """Apply bold and italic formatting to text"""
        if not text:
            return ""

        import re

        # Apply bold formatting (**text**)
        formatted = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)

        # Apply italic formatting (*text*) - but not if it's part of **text**
        formatted = re.sub(r'(?<!\*)\*([^*]+?)\*(?!\*)', r'<em>\1</em>', formatted)

        return formatted

    def save_tips_file(self, tips_data):
        """Save the tips content to JSON file"""
        try:
            tip_path = tips_data['tip']['path']
            file_name = f"{tip_path}.json"
            file_path = self.tips_content_dir / file_name

            # Transform the data into the expected format
            transformed_data = {
                'tip': tips_data['tip'],  # Keep the tip metadata as is
                'content': {}  # Transform the content sections
            }

            # Transform each content section
            for section_key, section_data in tips_data['content'].items():
                if isinstance(section_data, dict):
                    content = section_data.get('content', '')
                    enabled = section_data.get('enabled', True)

                    if enabled and content:
                        # Format markdown content to HTML
                        html_content = self.format_markdown_text(content)
                        transformed_data['content'][section_key] = html_content
                    else:
                        transformed_data['content'][section_key] = ''
                else:
                    # Handle string content directly
                    if section_data:
                        html_content = self.format_markdown_text(section_data)
                        transformed_data['content'][section_key] = html_content
                    else:
                        transformed_data['content'][section_key] = ''

            # Add timestamp
            transformed_data['lastModified'] = datetime.now().isoformat()
            transformed_data['tip']['updated_at'] = datetime.now().isoformat()

            # Write file with proper formatting
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(transformed_data, f, indent=2, ensure_ascii=False)

            print(f"\n✅ Tips content saved: {file_path}")
            return file_path

        except Exception as e:
            print(f"❌ Error saving tips file: {e}")
            return None

    def show_tips_preview(self, tips_data):
        """Show a preview of the tips content and start a development server"""
        tip_info = tips_data['tip']
        server_process = None

        print("\n" + "=" * 60)
        print("📋 TIPS CONTENT PREVIEW")
        print("=" * 60)
        print(f"🌍 Location: {tip_info['title']}")
        print(f"🗂️  Path: /tips/{tip_info['path']}")
        print(f"📅 Updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("-" * 60)

        # Show text preview
        sections = [
            ('🎯 Essential Tips', 'essentialTips'),
            ('💰 Budget Planning', 'budgetPlanning'),
            ('🍽️ Food & Dining', 'foodDining'),
            ('🚗 Transportation', 'transportation'),
            ('🏨 Accommodation', 'accommodation'),
            ('⚠️ Safety & Health', 'safetyHealth'),
        ]

        for title, key in sections:
            section_data = tips_data['content'].get(key, {})
            if isinstance(section_data, dict):
                content = section_data.get('content', '')
                enabled = section_data.get('enabled', True)
                if enabled and content:
                    print(f"\n{title}:")
                    preview = content
                    if len(preview) > 200:
                        preview = preview[:200] + "..."
                    print(f"  {preview}")
                else:
                    print(f"\n{title}:")
                    print("  (empty)")
            else:
                print(f"\n{title}:")
                print("  (empty)")

        print("\n" + "=" * 60)

        # Start development server for live preview
        print("\n🚀 Starting development server for preview...")
        print("Please wait while the server starts...")

        try:
            # Start the development server in the background
            server_process = subprocess.Popen(
                ['npm', 'start'],
                cwd=self.project_root,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )

            # Wait a bit for the server to start
            import time
            time.sleep(5)

            # Open the browser to the tips page
            import webbrowser
            webbrowser.open(f"http://localhost:3000/tips/{tip_info['path']}")

            print("\n✨ Development server started!")
            print(f"📱 Preview available at: http://localhost:3000/tips/{tip_info['path']}")
            print("\n🤔 Review the tips content in your browser.")
            print("👀 The content will be immediately available on your website.")

            # Get user approval
            response = input("\n✅ Approve and deploy these changes? (y/n): ").lower().strip()
            return response in ['y', 'yes']

        except Exception as e:
            print(f"\n❌ Failed to start development server: {e}")
            print("Continuing with text-based preview only...")
            response = input("\n✅ Approve and deploy these changes? (y/n): ").lower().strip()
            return response in ['y', 'yes']
        finally:
            # Clean up the server process if it exists
            if server_process:
                print("\n🛑 Stopping development server...")
                server_process.terminate()
                try:
                    server_process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    print("⚠️ Server taking too long to stop, forcing shutdown...")
                    server_process.kill()
                    server_process.wait()
                print("✅ Development server stopped")

    def get_user_approval(self):
        """Get user approval for the changes"""
        return self.show_tips_preview(self.tips_data)

    def generate_commit_message(self, tips_data):
        """Generate a descriptive commit message"""
        tip_info = tips_data['tip']

        if tip_info.get('state'):
            location = f"{tip_info['country']}, {tip_info['state']}"
        else:
            location = tip_info['country']

        return f"Update tips content: {location}"

def find_tips_file(filename):
    """Smart search for tips JSON file in common locations"""
    common_locations = [
        Path.home() / "Downloads",
        Path.home() / "Desktop",
        Path.home() / "Documents",
        Path.cwd(),  # Current directory
    ]

    # If filename is already a full path, try it first
    if Path(filename).exists():
        return Path(filename)

    # Extract just the filename if a path was provided
    filename = Path(filename).name

    print(f"🔍 Searching for '{filename}' in common locations...")

    for location in common_locations:
        if location.exists():
            file_path = location / filename
            if file_path.exists():
                print(f"✅ Found file at: {file_path}")
                return file_path
            else:
                print(f"❌ Not found in: {location}")

    return None

def main():
    """Main function to handle command line execution"""
    if len(sys.argv) != 2:
        print("Usage: python tips_manager.py <tips_json_filename>")
        print("Example: python tips_manager.py trinidad-and-tobago-tips.json")
        print("         python tips_manager.py ~/Downloads/trinidad-and-tobago-tips.json")
        print()
        print("The script will automatically search for the file in:")
        print("  • Downloads folder")
        print("  • Desktop")
        print("  • Documents")
        print("  • Current directory")
        sys.exit(1)

    filename = sys.argv[1]

    # Smart file search
    tips_file_path = find_tips_file(filename)

    if not tips_file_path:
        print(f"\n❌ Tips file '{filename}' not found in any common locations!")
        print("\nSearched in:")
        print("  • ~/Downloads/")
        print("  • ~/Desktop/")
        print("  • ~/Documents/")
        print("  • Current directory")
        print("\nPlease ensure the file exists in one of these locations.")
        sys.exit(1)

    try:
        # Load tips data from file
        with open(tips_file_path, 'r', encoding='utf-8') as f:
            tips_data = json.load(f)

        # Initialize tips manager and save content
        manager = TipsManager()
        success = manager.save_tips_content(tips_data)

        if success:
            print("\n🎉 Tips content deployment completed successfully!")
            sys.exit(0)
        else:
            print("\n💥 Tips content deployment failed!")
            sys.exit(1)

    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON file: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()