"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    __unsavedChangesCount?: number;
  }
}

/**
 * Shows a browser confirmation dialog when the user tries to leave the page
 * (browser back, refresh, close tab) while there are unsaved changes.
 *
 * Uses ref-counting so multiple components on the same page can independently
 * track dirty state without clobbering each other. ConfirmBackLink reads
 * window.__unsavedChangesCount > 0 to warn on client-side navigation.
 */
export function useUnsavedChanges(isDirty: boolean) {
  const countedRef = useRef(false);

  useEffect(() => {
    if (isDirty && !countedRef.current) {
      window.__unsavedChangesCount = (window.__unsavedChangesCount ?? 0) + 1;
      countedRef.current = true;
    } else if (!isDirty && countedRef.current) {
      window.__unsavedChangesCount = Math.max(
        (window.__unsavedChangesCount ?? 1) - 1,
        0,
      );
      countedRef.current = false;
    }

    return () => {
      if (countedRef.current) {
        window.__unsavedChangesCount = Math.max(
          (window.__unsavedChangesCount ?? 1) - 1,
          0,
        );
        countedRef.current = false;
      }
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
