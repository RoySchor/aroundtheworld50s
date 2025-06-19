"""Utility functions for blog management."""
from pathlib import Path
import json
import sys

REQUIRED_FIELDS = {
    "country": "Country name",
    "country_code": "Two letter country code",
    "title": "Blog post title",
    "background_image": "Main background image filename",
    "blog_description": "Short blog description"
}

ENHANCED_BLOG_REQUIRED_FIELDS = {
    "header": "Blog header text",
    "subtitle": "Blog subtitle",
    "description": "Blog description",
    "content": "Array of content sections"
}

LAYOUT_TYPES = ["text", "two-column", "image-grid", "itinerary-with-map"]

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

def is_enhanced_blog(json_data):
    """Check if the JSON contains enhanced blog structure."""
    return "enhanced_blog" in json_data

def validate_enhanced_blog(enhanced_blog_data):
    """Validate enhanced blog structure."""
    missing_fields = []
    for field, description in ENHANCED_BLOG_REQUIRED_FIELDS.items():
        if field not in enhanced_blog_data:
            missing_fields.append(f"{field} ({description})")

    if missing_fields:
        print("Error: Missing required fields in enhanced_blog:")
        for field in missing_fields:
            print(f"- {field}")
        sys.exit(1)

    # Validate content sections
    if "content" in enhanced_blog_data:
        for i, section in enumerate(enhanced_blog_data["content"]):
            if "key" not in section:
                print(f"Error: Content section {i} missing 'key' field")
                sys.exit(1)
            if "layout" not in section:
                print(f"Error: Content section {i} missing 'layout' field")
                sys.exit(1)
            if "type" not in section["layout"]:
                print(f"Error: Content section {i} layout missing 'type' field")
                sys.exit(1)
            if section["layout"]["type"] not in LAYOUT_TYPES:
                print(f"Error: Content section {i} has invalid layout type: {section['layout']['type']}")
                print(f"Valid types: {', '.join(LAYOUT_TYPES)}")
                sys.exit(1)

def create_component_name(country_name, state_name=None):
    """Create a component name from country and optional state."""
    component_name = serialize_location(country_name).replace("-", "").title()
    if state_name:
        state_name = serialize_location(state_name).replace("-", "").title()
        component_name = f"{component_name}{state_name}"
    return component_name

def create_constants_name(country_name, state_name=None):
    """Create a constants name from country and optional state."""
    constants_name = serialize_location(country_name).replace("-", "_").upper()
    if state_name:
        state_name = serialize_location(state_name).replace("-", "_").upper()
        constants_name = f"{constants_name}_{state_name}"
    return constants_name