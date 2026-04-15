import Link from "next/link";

export default function TipPreviewLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-white">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-gray-900 px-4 py-2 text-white">
        <span className="text-sm font-medium">Preview Mode</span>
        <PreviewCloseButton paramsPromise={params} />
      </div>
      {children}
    </div>
  );
}

async function PreviewCloseButton({
  paramsPromise,
}: {
  paramsPromise: Promise<{ id: string }>;
}) {
  const { id } = await paramsPromise;
  return (
    <Link
      href={`/admin/tips/${id}`}
      className="rounded bg-white/20 px-3 py-1 text-sm hover:bg-white/30"
    >
      Close Preview
    </Link>
  );
}
