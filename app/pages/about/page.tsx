import type { Metadata } from 'next';
import { AboutPageClient } from '@/components/about/AboutPageClient';

export const metadata: Metadata = {
  title: 'About Us — BOINNG!',
  description: 'Life\'s too short for boring socks. Meet the people, process, and passion behind BOINNG! — India\'s quirkiest sock brand.',
  alternates: {
    canonical: 'https://boinng.in/pages/about',
  },
  openGraph: {
    title: 'About BOINNG! | Quirky Socks Brand',
    description: 'Meet the story and people behind BOINNG!, India\'s quirky socks brand.',
    url: 'https://boinng.in/pages/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About BOINNG! | Quirky Socks Brand',
    description: 'Meet the story and people behind BOINNG!, India\'s quirky socks brand.',
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}