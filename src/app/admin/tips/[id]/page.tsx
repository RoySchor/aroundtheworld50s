import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConfirmBackLink } from "@/components/admin/ConfirmBackLink";
import { getTipById } from "@/server/repositories/admin-tips";
import { TipEditClient } from "@/components/admin/tips/TipEditClient";

export const metadata: Metadata = {
  title: "Edit Tip",
};

export default async function EditTipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tip = await getTipById(id);

  if (!tip) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <ConfirmBackLink href="/admin/tips">
        Back to Tips
      </ConfirmBackLink>

      <div>
        <h1 className="text-2xl font-bold">Edit Tip</h1>
        <p className="mt-1 text-sm text-gray-500">
          {tip.country}
          {tip.state ? ` (${tip.state})` : ""} &mdash; /tips/{tip.slug}
        </p>
      </div>

      <TipEditClient tip={tip} />
    </div>
  );
}
