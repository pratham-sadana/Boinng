import type { Metadata } from 'next';
import { AboutPageClient } from '@/components/about/AboutPageClient';

export const metadata: Metadata = {
  title: 'About Us — BOINNG!',
  description: 'Life\'s too short for boring socks. Meet the people, process, and passion behind BOINNG! — India\'s quirkiest sock brand.',
};

export default function AboutPage() {
  return <AboutPageClient />;
}