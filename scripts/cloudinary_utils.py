"""Cloudinary utilities for image uploads."""
import os
from pathlib import Path

try:
    import cloudinary
    import cloudinary.uploader
    CLOUDINARY_AVAILABLE = True
except ImportError:
    CLOUDINARY_AVAILABLE = False
    print("Warning: cloudinary package not installed. Run: pip install cloudinary")

# Cloudinary configuration
CLOUD_NAME = "dgfx5h5jl"
ASSET_PREFIX = "aroundtheworld50s"

def configure_cloudinary():
    """Configure Cloudinary with credentials from environment variables."""
    if not CLOUDINARY_AVAILABLE:
        return False

    api_key = os.environ.get('CLOUDINARY_API_KEY')
    api_secret = os.environ.get('CLOUDINARY_API_SECRET')

    if not api_key or not api_secret:
        print("Error: CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET environment variables must be set")
        print("You can find these in your Cloudinary dashboard")
        print("\nSet them by running:")
        print('  export CLOUDINARY_API_KEY="your_api_key"')
        print('  export CLOUDINARY_API_SECRET="your_api_secret"')
        return False

    cloudinary.config(
        cloud_name=CLOUD_NAME,
        api_key=api_key,
        api_secret=api_secret,
        secure=True
    )
    return True

def upload_blog_image(local_path, blog_path, image_name):
    """
    Upload a single blog image to Cloudinary.

    Args:
        local_path: Path to the local image file
        blog_path: The blog path (e.g., "trinidad-and-tobago/1")
        image_name: The image filename

    Returns:
        The Cloudinary URL or None if upload failed
    """
    if not CLOUDINARY_AVAILABLE:
        print("Error: cloudinary package not installed")
        return None

    # Remove file extension from public_id
    name_without_ext = Path(image_name).stem
    public_id = f"{ASSET_PREFIX}/blog/{blog_path}/{name_without_ext}"

    try:
        result = cloudinary.uploader.upload(
            str(local_path),
            public_id=public_id,
            overwrite=True,
            resource_type="image"
        )
        print(f"  ✅ Uploaded: {image_name}")
        return result.get('secure_url')
    except Exception as e:
        print(f"  ❌ Failed to upload {image_name}: {e}")
        return None

def upload_gallery_image(local_path, image_name):
    """
    Upload a home page gallery image to Cloudinary.

    Args:
        local_path: Path to the local image file
        image_name: The image filename

    Returns:
        The Cloudinary URL or None if upload failed
    """
    if not CLOUDINARY_AVAILABLE:
        print("Error: cloudinary package not installed")
        return None

    name_without_ext = Path(image_name).stem
    public_id = f"{ASSET_PREFIX}/homePageGallery/{name_without_ext}"

    try:
        result = cloudinary.uploader.upload(
            str(local_path),
            public_id=public_id,
            overwrite=True,
            resource_type="image",
            tags=["homePageGallery"]  # Tag for resource list API
        )
        print(f"  ✅ Uploaded: {image_name}")
        return result.get('secure_url')
    except Exception as e:
        print(f"  ❌ Failed to upload {image_name}: {e}")
        return None


def delete_gallery_image(image_name):
    """
    Delete a home page gallery image from Cloudinary.

    Args:
        image_name: The image filename

    Returns:
        True if deleted successfully, False otherwise
    """
    if not CLOUDINARY_AVAILABLE:
        print("Error: cloudinary package not installed")
        return False

    name_without_ext = Path(image_name).stem
    public_id = f"{ASSET_PREFIX}/homePageGallery/{name_without_ext}"

    try:
        result = cloudinary.uploader.destroy(public_id)
        if result.get('result') == 'ok':
            print(f"  ✅ Deleted: {image_name}")
            return True
        else:
            print(f"  ⚠️ Could not delete {image_name}: {result}")
            return False
    except Exception as e:
        print(f"  ❌ Failed to delete {image_name}: {e}")
        return False

def upload_blog_images(source_dir, blog_path):
    """
    Upload all images from a source directory to Cloudinary.

    Args:
        source_dir: Path to the source directory containing images
        blog_path: The blog path (e.g., "trinidad-and-tobago/1")

    Returns:
        List of uploaded image names
    """
    if not configure_cloudinary():
        return []

    uploaded = []
    source_path = Path(source_dir)

    print(f"\n📤 Uploading images to Cloudinary...")

    for file in source_path.glob("*"):
        if file.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp', '.gif']:
            url = upload_blog_image(file, blog_path, file.name)
            if url:
                uploaded.append(file.name)

    print(f"\n✅ Uploaded {len(uploaded)} images to Cloudinary")
    return uploaded

def get_cloudinary_blog_url(blog_path, image_name):
    """
    Get the Cloudinary URL for a blog image (without uploading).

    Args:
        blog_path: The blog path (e.g., "trinidad-and-tobago/1")
        image_name: The image filename

    Returns:
        The Cloudinary URL
    """
    return f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{ASSET_PREFIX}/blog/{blog_path}/{image_name}"
