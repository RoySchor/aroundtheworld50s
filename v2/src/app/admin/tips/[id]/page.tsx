import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
      <div>
        <h1 className="text-2xl font-bold">Edit Tip</h1>
        <p className="mt-1 text-sm text-gray-500">
          {tip.country}
          {tip.state ? ` (${tip.state})` : ""} &mdash; /tips/{tip.slug}
        </p>
      </div>

      <TipStatusBar tipId={tip.id} status={tip.status} slug={tip.slug} />

      <TipMetadataForm tip={tip} />

      <hr />

      <TipSectionsEditor tipId={tip.id} sections={tip.sections} />
    </div>
  );
}
