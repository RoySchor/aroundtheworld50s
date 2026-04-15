"use client";

import { useEffect } from "react";

/**
 * Shows a browser confirmation dialog when the user tries to leave the page
 * (browser back, refresh, close tab) while there are unsaved changes.
 *
 * Does NOT intercept Next.js client-side navigation (sidebar links, back button).
 */
export function useUnsavedChanges(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);
}
