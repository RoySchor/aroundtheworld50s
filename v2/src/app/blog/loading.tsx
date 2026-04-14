export default function BlogLoading() {
  return (
    <div className="page-container mt-44">
      <div className="container">
        <div className="page-content text-center">
          <div className="mb-8 h-8 w-48 mx-auto animate-pulse rounded bg-gray-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-center">
                <div className="p-3">
                  <div className="h-5 w-40 mx-auto mb-2 animate-pulse rounded bg-gray-200" />
                  <div className="h-[400px] w-[400px] max-w-full animate-pulse bg-gray-200" />
                  <div className="h-4 w-24 mx-auto mt-1 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
