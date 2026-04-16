"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface ConfirmBackLinkProps {
  href: string;
  children: React.ReactNode;
}

export function ConfirmBackLink({ href, children }: ConfirmBackLinkProps) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    if ((window.__unsavedChangesCount ?? 0) > 0) {
      const ok = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?",
      );
      if (!ok) {
        e.preventDefault();
        return;
      }
    }
    e.preventDefault();
    router.push(href);
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
    >
      <ArrowLeft size={16} />
      {children}
    </a>
  );
}
