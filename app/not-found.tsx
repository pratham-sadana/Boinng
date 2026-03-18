import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-boinng-bg">
      <div className="text-center">
        <h1 className="font-display text-6xl mb-4 text-boinng-black">404</h1>
        <p className="text-xl text-black/60 mb-8">Page not found</p>
        <Link
          href="/"
          className="inline-block bg-boinng-blue text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:shadow-lg transition-shadow"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
