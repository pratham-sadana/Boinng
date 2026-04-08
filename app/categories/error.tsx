'use client';

import Link from 'next/link';

export default function CategoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('Category page error:', error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-boinng-bg px-4">
      <div className="text-center max-w-md">
        <h1 className="font-display text-6xl mb-4 text-boinng-black">⚠️</h1>
        <h2 className="text-2xl font-bold mb-2 text-boinng-black">Category Not Found</h2>
        <p className="text-black/60 mb-8">
          The category you're looking for doesn't exist or there was an issue loading it.
        </p>

        <div className="flex gap-4 flex-col sm:flex-row justify-center">
          <button
            onClick={reset}
            className="bg-boinng-blue text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:shadow-lg transition-shadow"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="bg-boinng-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:shadow-lg transition-shadow"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
