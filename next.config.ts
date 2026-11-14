import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-loader.ts",
  },
  // The Wagner Park post was first published under /blog/united-states before
  // US posts were keyed by state; keep any shared links working.
  redirects: async () => [
    { source: "/blog/united-states", destination: "/blog/united-states-new-york", permanent: true },
    {
      source: "/blog/united-states/1",
      destination: "/blog/united-states-new-york/4",
      permanent: true,
    },
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
