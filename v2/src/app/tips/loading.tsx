export default function TipsLoading() {
  return (
    <div className="page-container mt-44">
      <div className="container">
        <div className="page-content text-center">
          <div className="mb-4 h-8 w-80 mx-auto animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-64 mx-auto mb-12 animate-pulse rounded bg-gray-100" />
          <div className="tips-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="block bg-white rounded-xl p-6"
                style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-9 h-6 animate-pulse rounded bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-6 w-2/3 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-1/2 mt-2 animate-pulse rounded bg-gray-100" />
                  </div>
                </div>
                <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-3/4 mt-2 animate-pulse rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
