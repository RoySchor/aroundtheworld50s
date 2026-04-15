import Link from "next/link";

export default function BlogPreviewLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  // We need to await params but can't do it synchronously in a layout render.
  // Instead, wrap the close button in a client component or use a simple approach.
  // Since layout params are available as a promise in Next.js 15+, we use a
  // generic close approach.
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
      href={`/admin/blog/${id}`}
      className="rounded bg-white/20 px-3 py-1 text-sm hover:bg-white/30"
    >
      Close Preview
    </Link>
  );
}
