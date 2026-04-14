import type { Metadata } from "next";
import { CreateTipForm } from "@/components/admin/tips/CreateTipForm";

export const metadata: Metadata = {
  title: "Create Tip",
};

export default function NewTipPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Create New Tip</h1>
      <CreateTipForm />
    </div>
  );
}
