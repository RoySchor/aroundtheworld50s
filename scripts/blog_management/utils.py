"""Utility functions for blog management."""
from pathlib import Path
import json
import sys
import os
import subprocess
import re

REQUIRED_FIELDS = {
    "country": "Country name",
    "country_code": "Two letter country code",
    "title": "Blog post title",
    "background_image": "Main background image filename",
    "blog_description": "Short blog description"
}

BLOG_REQUIRED_FIELDS = {
    "header": "Blog header text",
    "subtitle": "Blog subtitle",
    "description": "Blog description",
    "content": "Array of content sections"
}

LAYOUT_TYPES = ["text", "two-column", "image-grid", "itinerary-with-map", "instagram"]

def get_desktop_path():
    """Get the path to the user's Desktop directory."""
    return Path.home() / "Desktop"

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

    # Validate blog structure
    if "blog" not in json_data:
        print("Error: Missing required 'blog' object")
        print("All blogs must include a 'blog' object with rich content structure")
        sys.exit(1)

    validate_blog(json_data['blog'])

def get_next_post_index(assets_dir):
    """Get the next available post index for a country."""
    if not assets_dir.exists():
        return 1

    existing_dirs = [d for d in assets_dir.iterdir() if d.is_dir() and d.name.isdigit()]
    if not existing_dirs:
        return 1

    return max(int(d.name) for d in existing_dirs) + 1

def validate_blog(blog_data):
    """Validate blog structure."""
    missing_fields = []
    for field, description in BLOG_REQUIRED_FIELDS.items():
        if field not in blog_data:
            missing_fields.append(f"{field} ({description})")

    if missing_fields:
        print("Error: Missing required fields in blog:")
        for field in missing_fields:
            print(f"- {field}")
        sys.exit(1)

    # Validate content sections
    if "content" in blog_data:
        for i, section in enumerate(blog_data["content"]):
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

def serialize_location(location):
    """Convert location name to URL-friendly format."""
    return location.lower().replace(" ", "-").replace("&", "and")

def create_component_name(country, state=None):
    """Create a component name from country and optional state."""
    if state:
        return f"{country.replace(' ', '').replace('&', 'And')}{state.replace(' ', '')}"
    return country.replace(' ', '').replace('&', 'And')

def create_constants_name(country, state=None):
    """Create a constants name from country and optional state."""
    if state:
        return f"{country.upper().replace(' ', '_').replace('&', '_AND_')}_{state.upper().replace(' ', '_')}"
    return country.upper().replace(' ', '_').replace('&', '_AND_')

def convert_markdown_links(text):
    """Convert markdown-style links [text](url) to HTML anchor tags."""
    if not text:
        return text

    # Pattern to match [text](url)
    pattern = r'\[([^\]]+)\]\(([^)]+)\)'

    def replace_link(match):
        link_text = match.group(1)
        url = match.group(2)
        return f'<a href="{url}" class="post-link" target="_blank" rel="noopener noreferrer">{link_text}</a>'

    return re.sub(pattern, replace_link, text)

def normalize_us_country(country, country_code):
    """Normalize US country variants to standard format."""
    if not country and not country_code:
        return country, country_code

    normalized_country = country.lower().strip() if country else ""
    normalized_code = country_code.upper().strip() if country_code else ""

    us_variants = [
        'us',
        'usa',
        'united states',
        'united states of america',
        'america',
        'u.s.',
        'u.s.a.',
        'u.s.a',
    ]

    if normalized_code == 'US' or normalized_country in us_variants:
        return "United States", "US"

    return country, country_code

def is_us_country(country, country_code):
    """Check if country is a US variant."""
    normalized_country, normalized_code = normalize_us_country(country, country_code)
    return normalized_country == "United States" and normalized_code == "US"