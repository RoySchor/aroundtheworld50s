export type SocialLink = {
  platform: "instagram" | "tiktok";
  url: string;
  label: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "instagram",
    url: "https://www.instagram.com/aroundtheworld50s/",
    label: "Instagram",
  },
  {
    platform: "tiktok",
    url: "https://www.tiktok.com/@aroundtheworld50s",
    label: "TikTok",
  },
];
