#!/bin/bash

# Get current timestamp for version
NEW_VERSION=$(date +%Y%m%d_%H%M%S)

# Update version in index.html
sed -i '' "s/content=\"[0-9]\+\.[0-9]\+\.[0-9]\+\"/content=\"$NEW_VERSION\"/" public/index.html

echo "Updated version to $NEW_VERSION"