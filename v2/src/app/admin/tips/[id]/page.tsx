import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConfirmBackLink } from "@/components/admin/ConfirmBackLink";
import { getTipById } from "@/server/repositories/admin-tips";
import { TipStatusBar } from "@/components/admin/tips/TipStatusBar";
import { TipMetadataForm } from "@/components/admin/tips/TipMetadataForm";
import { TipSectionsEditor } from "@/components/admin/tips/TipSectionsEditor";

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

      <div className="sticky top-0 z-10 -mx-8 bg-gray-50 px-8 pb-4 pt-8 shadow-sm">
        <TipStatusBar tipId={tip.id} status={tip.status} slug={tip.slug} />
      </div>

      <TipMetadataForm tip={tip} />

      <hr />

      <TipSectionsEditor sections={tip.sections} />
    </div>
  );
}
