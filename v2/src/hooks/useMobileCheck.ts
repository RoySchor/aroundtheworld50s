"use client";

import { useState, useEffect } from "react";

const DEFAULT_BREAKPOINT = 1024;

export function useMobileCheck(breakpoint = DEFAULT_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    setChecked(true);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return { isMobile, checked };
}
