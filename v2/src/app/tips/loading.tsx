export default function TipsLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-8 h-8 w-48 animate-pulse rounded bg-gray-200" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border">
            <div className="space-y-3 p-5">
              <div className="h-6 w-2/3 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
