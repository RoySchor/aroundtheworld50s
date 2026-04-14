import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminProfileIfAuthenticated } from "@/server/auth";
import { LoginForm } from "@/components/auth/LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const profile = await getAdminProfileIfAuthenticated();
  if (profile) redirect("/admin");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
