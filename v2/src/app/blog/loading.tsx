export default function BlogLoading() {
  return (
    <div className="page-container mt-44">
      <div className="container">
        <div className="page-content text-center">
          <div className="mb-8 h-8 w-48 mx-auto animate-pulse rounded bg-gray-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-center">
                <div className="w-full">
                  <div className="border-[0.5em] border-transparent w-full">
                    <div className="p-[0.5em] border-[0.5em] border-transparent w-full">
                      <div className="h-5 w-40 mx-auto mb-2 animate-pulse rounded bg-gray-200" />
                      <div className="w-full h-[200px] sm:h-[275px] animate-pulse rounded bg-gray-200" />
                    </div>
                  </div>
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
