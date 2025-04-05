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