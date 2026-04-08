'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Category page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-boinng-bg">
      <div className="text-center">
        <h1 className="font-display text-6xl mb-4 text-boinng-black">Oops!</h1>
        <p className="text-xl text-black/60 mb-4">Failed to load category</p>
        <p className="text-sm text-black/40 mb-8 max-w-md">{error.message || 'Something went wrong. Please try again.'}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="inline-block bg-boinng-blue text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:shadow-lg transition-shadow"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-block bg-black/10 text-boinng-black px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:shadow-lg transition-shadow"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
