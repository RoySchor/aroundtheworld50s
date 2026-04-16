"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __unsavedChanges?: boolean;
  }
}

/**
 * Shows a browser confirmation dialog when the user tries to leave the page
 * (browser back, refresh, close tab) while there are unsaved changes.
 *
 * Also sets a global flag that ConfirmBackLink reads to warn on
 * client-side navigation.
 */
export function useUnsavedChanges(isDirty: boolean) {
  useEffect(() => {
    window.__unsavedChanges = isDirty;
    return () => {
      window.__unsavedChanges = false;
    };
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty) return;

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);
}
