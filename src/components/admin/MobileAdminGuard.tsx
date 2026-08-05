"use client";

import { useMobileCheck } from "@/hooks/useMobileCheck";

export function MobileAdminGuard({ children }: { children: React.ReactNode }) {
  const { isMobile, checked } = useMobileCheck();

  if (!checked) return null;

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-50 px-6">
        <div className="bg-white rounded-2xl shadow-xl max-w-sm p-8 text-center">
          <h1 className="text-xl font-bold text-gray-800 mb-4">Desktop Only</h1>
          <p className="text-gray-600 mb-6">
            Admin is only available on laptops. Please switch to a laptop to manage the website.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-gray-800 text-white rounded-full font-semibold hover:bg-gray-700 transition-colors"
          >
            Back to site
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
