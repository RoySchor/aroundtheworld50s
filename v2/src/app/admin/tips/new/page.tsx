import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreateTipForm } from "@/components/admin/tips/CreateTipForm";

export const metadata: Metadata = {
  title: "Create Tip",
};

export default function NewTipPage() {
  return (
    <div>
      <Link
        href="/admin/tips"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft size={16} />
        Back to Tips
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Create New Tip</h1>
      <CreateTipForm />
    </div>
  );
}
