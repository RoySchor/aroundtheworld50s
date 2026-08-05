"use client";

import Link from "next/link";
import Image from "next/image";
import { STATIC_ASSETS } from "@/lib/cloudinary";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (process.env.NODE_ENV === "development") {
    console.error("[ErrorBoundary]", error);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Image
        src={STATIC_ASSETS.logo}
        alt="Around the World 50s Logo"
        width={128}
        height={128}
        className="mb-8 animate-bounce"
      />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Something went wrong!</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Don&apos;t worry, even the best travelers hit a detour sometimes.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
