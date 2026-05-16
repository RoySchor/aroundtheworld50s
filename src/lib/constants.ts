export const SITE_NAME = "Around the World 50s";
export const SITE_DESCRIPTION =
  "A travel blog exploring the world one destination at a time";

export const CLOUDINARY_CLOUD_NAME = "dgfx5h5jl";
export const CLOUDINARY_ASSET_PREFIX = "aroundtheworld50s";
export const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export type NavLink = {
  label: string;
  href: string;
};

export const NAV_LINKS_LEFT: NavLink[] = [
  { label: "HOME", href: "/" },
  { label: "ABOUT ME", href: "/about" },
  { label: "DESTINATIONS", href: "/destinations" },
];

export const NAV_LINKS_RIGHT: NavLink[] = [
  { label: "BLOG", href: "/blog" },
  { label: "TIPS", href: "/tips" },
];

export const TRANSPARENT_NAVBAR_PATHS = ["/", "/destinations"];
