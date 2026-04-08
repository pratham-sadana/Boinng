import dynamic from 'next/dynamic';
import Script from 'next/script';
import { Hero }             from '@/components/home/Hero';
import { Marquee }          from '@/components/layout/Marquee';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { getMenuTitles } from '@/lib/shopify/api';
import { createOrganizationSchema } from '@/lib/shopify/sanitize';

// Lazy-load below-the-fold sections for faster initial load
const Features      = dynamic(() => import('@/components/home/Features').then(m => ({ default: m.Features })));
const BrandStory    = dynamic(() => import('@/components/home/BrandStory').then(m => ({ default: m.BrandStory })));
const Testimonials  = dynamic(() => import('@/components/home/Testimonials').then(m => ({ default: m.Testimonials })));
const InstagramFeed = dynamic(() => import('@/components/home/InstagramFeed').then(m => ({ default: m.InstagramFeed })));
const FinalCTA      = dynamic(() => import('@/components/home/FinalCTA').then(m => ({ default: m.FinalCTA })));

const TOP_MARQUEE_MENU_HANDLE = 'first-marquee';
const BOTTOM_MARQUEE_MENU_HANDLE = 'second-marquee';

const TOP_MARQUEE_FALLBACK = [
  'NEW DROPS EVERY FRIDAY',
  'FREE SHIPPING OVER ₹799',
  'LIMITED EDITION ONLY',
  'STREETWEAR FOR THE BOLD',
  'MADE IN INDIA',
];

const BOTTOM_MARQUEE_FALLBACK = [
  'ONLY THE BOLD',
  'LIMITED DROPS',
  "INDIA'S OWN",
  'MAKE IT BOINNG!',
  'STREETWEAR FIRST',
];

export default async function HomePage() {
  const [topMarqueeItems, bottomMarqueeItems] = await Promise.all([
    getMenuTitles(TOP_MARQUEE_MENU_HANDLE),
    getMenuTitles(BOTTOM_MARQUEE_MENU_HANDLE),
  ]);

  const topItems = topMarqueeItems.length > 0 ? topMarqueeItems : TOP_MARQUEE_FALLBACK;
  const bottomItems = bottomMarqueeItems.length > 0 ? bottomMarqueeItems : BOTTOM_MARQUEE_FALLBACK;

  return (
    <>
      {/* JSON-LD Schema for Organization */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: createOrganizationSchema(),
        }}
      />

      {/* 1. Hero — first impression, scroll-scrub video */}
      <Hero />

      <FeaturedProducts
        title="Everyone’s obsessed with these"
        collectionHandle="best-sellers"
        limit={8}
        prioritizeImages
      />
      <FinalCTA />
      
      {/* <Marquee speed={130} items={topItems} /> */}

      {/* <FeaturedCollections limit={6} /> */}

      {/* 5. New Arrivals — reward browsers who kept scrolling */}
      <FeaturedProducts
        title="NEW ARRIVALS"
        collectionHandle="new-arrivals"
        limit={8}
        prioritizeImages={false}
      />
     
      {/* 6. Why BOINNG! — builds trust before asking for the sale */}

      {/* <FeaturedCollections
        limit={6}
        mode="all"
        excludeHandles={[
          'new-arrivals',
          'best-sellers',
          'sale',
          'ankle-length',
          'crew-length',
          'solids',
        ]}
      /> */}
      <Features />

      {/* 7. Brand story — who we are, why it matters */}
      {/* <BrandStory /> */}

      {/* 8. Dark marquee — palette break, keeps energy up */}
      <div className="hidden md:block">
        <Marquee
          speed={70}
          white
          items={bottomItems}
        />
      </div>

      {/* 9. Social proof — Instagram + testimonials together for max credibility */}
      <InstagramFeed />
      <Testimonials />

      {/* 10. Final CTA — capture intent at the very end */}
      
    </>
  );
}