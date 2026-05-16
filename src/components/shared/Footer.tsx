import Link from "next/link";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { SOCIAL_LINKS } from "@/lib/constants/social-links";

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-4">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="hover:text-gray-300 transition-colors"
            >
              {link.platform === "instagram" ? (
                <InstagramIcon className="w-5 h-5" />
              ) : (
                <TikTokIcon className="w-5 h-5" />
              )}
            </a>
          ))}
        </div>
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Around the World 50s. All rights
          reserved.
        </p>
        <Link
          href="/admin"
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Admin
        </Link>
      </div>
    </footer>
  );
}
