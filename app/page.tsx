import dynamic from 'next/dynamic';
import { Hero }             from '@/components/home/Hero';
import { Marquee }          from '@/components/layout/Marquee';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';

// Lazy-load below-the-fold sections for faster initial load
const Features      = dynamic(() => import('@/components/home/Features').then(m => ({ default: m.Features })));
const BrandStory    = dynamic(() => import('@/components/home/BrandStory').then(m => ({ default: m.BrandStory })));
const Testimonials  = dynamic(() => import('@/components/home/Testimonials').then(m => ({ default: m.Testimonials })));
const InstagramFeed = dynamic(() => import('@/components/home/InstagramFeed').then(m => ({ default: m.InstagramFeed })));
const FinalCTA      = dynamic(() => import('@/components/home/FinalCTA').then(m => ({ default: m.FinalCTA })));

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — first impression, scroll-scrub video */}
      <Hero />

      {/* 2. Energy burst immediately after hero — keeps momentum */}
      <Marquee speed={130} />

      {/* 3. Best Sellers — product discovery #1 priority, hottest items first */}
      <FeaturedProducts
        title="BEST SELLERS"
        collectionHandle="best-sellers"
        limit={8}
      />

      {/* 4. Collections — let users self-select their category */}
      <FeaturedCollections limit={6} />

      {/* 5. New Arrivals — reward browsers who kept scrolling */}
      <FeaturedProducts
        title="NEW ARRIVALS"
        collectionHandle="new-arrivals"
        limit={8}
      />

      {/* 6. Why BOINNG! — builds trust before asking for the sale */}
      <Features />

      {/* 7. Brand story — who we are, why it matters */}
      <BrandStory />

      {/* 8. Dark marquee — palette break, keeps energy up */}
      <Marquee
        speed={20}
        white
        items={["ONLY THE BOLD", "LIMITED DROPS", "INDIA'S OWN", "MAKE IT BOINNG!", "STREETWEAR FIRST"]}
      />

      {/* 9. Social proof — Instagram + testimonials together for max credibility */}
      <InstagramFeed />
      <Testimonials />

      {/* 10. Final CTA — capture intent at the very end */}
      <FinalCTA />
    </>
  );
}