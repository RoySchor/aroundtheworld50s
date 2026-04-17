import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getAdminProfileIfAuthenticated } from "@/server/auth";
import { LoginForm } from "@/components/auth/LoginForm";
import { STATIC_ASSETS } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const profile = await getAdminProfileIfAuthenticated();
  if (profile) redirect("/admin");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-32 lg:pt-48">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <Image
            src={STATIC_ASSETS.logo}
            alt="Around the World 50s"
            width={120}
            height={120}
            className="h-28 w-28"
          />
        </div>
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Admin Login
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
