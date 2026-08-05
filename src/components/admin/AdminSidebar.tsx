"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/server/auth/actions";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Blog Posts", href: "/admin/blog" },
  { label: "Tips", href: "/admin/tips" },
  { label: "Cover Photos", href: "/admin/cover-photos" },
  { label: "Home Gallery", href: "/admin/gallery" },
];

export function AdminSidebar({ displayName }: { displayName: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <p className="text-xl font-semibold text-gray-300 truncate text-center">
          יום טוב, {displayName}
        </p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {ADMIN_NAV.map((link) => {
          const isActive =
            pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded text-lg ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-700 space-y-1">
        <Link
          href="/"
          className="block px-3 py-2 text-lg text-gray-300 hover:bg-gray-800 hover:text-white rounded"
        >
          &larr; Back to Site
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="w-full text-left px-3 py-2 text-lg text-gray-300 hover:bg-gray-800 hover:text-white rounded"
          >
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
