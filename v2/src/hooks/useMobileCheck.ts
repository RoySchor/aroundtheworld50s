"use client";

import { useState, useEffect } from "react";

const DEFAULT_BREAKPOINT = 1024;

export function useMobileCheck(breakpoint = DEFAULT_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(mql.matches);
    setChecked(true);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return { isMobile, checked };
}
