#!/bin/bash

# Auto Blog Generator Script
# This script automatically finds, unzips, and processes blog folders

set -e  # Exit on any error

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Get the project root directory (two levels up from the script directory)
PROJECT_PATH="$( cd "$SCRIPT_DIR/../.." && pwd )"

DESKTOP_PATH="$HOME/Desktop"

echo "🚀 Auto Blog Generator"
echo "====================="

# Function to find blog zip files
find_blog_zips() {
    find "$DESKTOP_PATH" -maxdepth 1 -name "*-blog.zip" -type f 2>/dev/null
}

# Function to find blog folders
find_blog_folders() {
    find "$DESKTOP_PATH" -maxdepth 1 -name "*-blog" -type d 2>/dev/null
}

# Check if we're in the right directory
if [ ! -d "$PROJECT_PATH" ]; then
    echo "❌ Error: Project directory not found at $PROJECT_PATH"
    echo "Please make sure your project is located at the expected path"
    exit 1
fi

cd "$PROJECT_PATH"

# Look for blog zip files first
blog_zips=($(find_blog_zips))
blog_folders=($(find_blog_folders))

if [ ${#blog_zips[@]} -gt 0 ]; then
    echo "📦 Found blog zip file(s):"
    for zip_file in "${blog_zips[@]}"; do
        echo "  - $(basename "$zip_file")"
    done

    # Process each zip file
    for zip_file in "${blog_zips[@]}"; do
        echo ""
        echo "🔄 Processing: $(basename "$zip_file")"

        # Extract the folder name without .zip extension
        folder_name=$(basename "$zip_file" .zip)

        # Unzip to Desktop
        echo "📂 Unzipping to Desktop..."
        cd "$DESKTOP_PATH"
        unzip -q "$zip_file" -d "$folder_name"

        # Check if extraction was successful
        if [ -d "$folder_name" ]; then
            echo "✅ Successfully extracted to: $folder_name"

            # Move back to project directory
            cd "$PROJECT_PATH"

            # Run the blog generation script
            echo "🚀 Running blog generation script..."
            cd "$PROJECT_PATH"
            PYTHONPATH="$PROJECT_PATH/scripts/blog_management" python3 scripts/blog_management/blog_manager.py

            # Clean up the zip file
            echo "🗑️  Cleaning up zip file..."
            rm "$zip_file"

        else
            echo "❌ Failed to extract $zip_file"
        fi
    done

elif [ ${#blog_folders[@]} -gt 0 ]; then
    echo "📁 Found existing blog folder(s):"
    for folder in "${blog_folders[@]}"; do
        echo "  - $(basename "$folder")"
    done

    cd "$PROJECT_PATH"
    echo "🚀 Running blog generation script..."
    python3 scripts/blog_management/blog_manager.py

else
    echo "❌ No blog files found on Desktop"
    echo "Please make sure you have either:"
    echo "  - A *-blog.zip file, or"
    echo "  - A *-blog folder"
    echo "on your Desktop"
    exit 1
fi

echo ""
echo "✨ Blog generation complete! ✨"