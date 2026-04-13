"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import {
  NAV_LINKS_LEFT,
  NAV_LINKS_RIGHT,
  TRANSPARENT_NAVBAR_PATHS,
} from "@/lib/constants";
import { SOCIAL_LINKS } from "@/lib/constants/social-links";
import { getStaticAssetUrl, STATIC_ASSETS } from "@/lib/cloudinary";

function SocialIcons({ className }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-4 ${className ?? ""}`}>
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="text-white hover:text-gray-300 transition-colors"
        >
          {link.platform === "instagram" ? (
            <InstagramIcon className="w-5 h-5" />
          ) : (
            <TikTokIcon className="w-5 h-5" />
          )}
        </a>
      ))}
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isTransparent =
    TRANSPARENT_NAVBAR_PATHS.includes(pathname) ||
    pathname.startsWith("/blog/");

  const logoUrl = getStaticAssetUrl("around_the_world_50s_logo.png");

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors ${
        isTransparent ? "bg-transparent" : "bg-gray-600 shadow-md"
      }`}
    >
      {/* Desktop Nav */}
      <div className="hidden lg:flex items-center justify-center py-2">
        <div className="flex items-center space-x-6">
          {NAV_LINKS_LEFT.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-white text-xl font-bold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link href="/" className="mx-8 flex items-center justify-center z-50">
          <Image
            src={logoUrl}
            alt="Around the World 50s"
            width={176}
            height={176}
            className="h-44 w-44 logo-rotate"
            priority
          />
        </Link>

        <div className="flex items-center space-x-6">
          {NAV_LINKS_RIGHT.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-white text-xl font-bold transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <SocialIcons />
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="flex lg:hidden items-center justify-between w-full px-4 py-2">
        <Link href="/" className="flex items-center">
          <Image
            src={logoUrl}
            alt="Around the World 50s"
            width={96}
            height={96}
            className="h-24 w-24"
            priority
          />
        </Link>

        <div className="flex items-center space-x-4">
          <SocialIcons />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white text-3xl"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-8 h-8" />
            ) : (
              <Menu className="w-8 h-8" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-black/50 backdrop-blur-sm py-4">
          {[...NAV_LINKS_LEFT, ...NAV_LINKS_RIGHT].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center text-white text-xl font-bold py-2 nav-link"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
