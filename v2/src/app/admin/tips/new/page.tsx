import type { Metadata } from "next";
import { ConfirmBackLink } from "@/components/admin/ConfirmBackLink";
import { CreateTipForm } from "@/components/admin/tips/CreateTipForm";

export const metadata: Metadata = {
  title: "Create Tip",
};

export default function NewTipPage() {
  return (
    <div>
      <div className="mb-4">
        <ConfirmBackLink href="/admin/tips">
          Back to Tips
        </ConfirmBackLink>
      </div>
      <h1 className="mb-6 text-2xl font-bold">Create New Tip</h1>
      <CreateTipForm />
    </div>
  );
}
