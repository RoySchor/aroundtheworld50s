import type { Metadata } from "next";
import { getAuthenticatedAdmin } from "@/server/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileAdminGuard } from "@/components/admin/MobileAdminGuard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getAuthenticatedAdmin();

  return (
    <MobileAdminGuard>
      <div className="fixed inset-0 z-[100] flex bg-gray-50">
        <AdminSidebar displayName={profile.displayName ?? "Admin"} />
        <div className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </MobileAdminGuard>
  );
}
