import { getAuthenticatedAdmin } from "@/server/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getAuthenticatedAdmin();

  return <>{children}</>;
}
