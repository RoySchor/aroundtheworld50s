"use client";

import { useCallback, useSyncExternalStore } from "react";

const DEFAULT_BREAKPOINT = 1024;

export function useMobileCheck(breakpoint = DEFAULT_BREAKPOINT) {
  const query = `(max-width: ${breakpoint - 1}px)`;

  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  // null on the server and during hydration, so callers can wait for the real value
  const isMobile = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => null,
  );

  return { isMobile: isMobile === true, checked: isMobile !== null };
}
