"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * v1 used React HashRouter, producing URLs like `/#/blog/scotland/0`.
 * The hash never reaches the server, so redirects must happen client-side.
 * This component runs once on mount and redirects any v1 hash URL to the
 * equivalent v2 path, preserving bookmarks and shared links.
 */
export function HashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.startsWith("#/")) return;

    // Strip the leading "#" to get the path (e.g. "/blog/scotland/0")
    const path = hash.slice(1);

    // Only redirect known v1 route prefixes
    if (
      path.startsWith("/blog") ||
      path.startsWith("/tips") ||
      path.startsWith("/about") ||
      path.startsWith("/destinations")
    ) {
      router.replace(path);
    }
  }, [router]);

  return null;
}
