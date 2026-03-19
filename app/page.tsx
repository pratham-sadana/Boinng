import { Hero }             from '@/components/home/Hero';
import { Marquee }          from '@/components/layout/Marquee';
import { Features }         from '@/components/home/Features';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Testimonials }     from '@/components/home/Testimonials';
import { InstagramFeed }    from '@/components/home/InstagramFeed';
import { FinalCTA }         from '@/components/home/FinalCTA';


export default function HomePage() {
  return (
    <>
      {/* Scroll-scrubbing video hero — 300vh scroll section */}
      <Hero />

      {/* Ticker marquee after hero */}
      <Marquee speed={130}/>

      {/* Featured products — Best Sellers */}
      <FeaturedProducts 
        title="BEST SELLERS" 
        collectionHandle="best-sellers"
        limit={4}
      />

      {/* Featured products — New Arrivals */}
      <FeaturedProducts 
        title="NEW ARRIVALS" 
        collectionHandle="new-arrivals"
        limit={4}
      />

      {/* Why BOINNG! feature grid */}
      <Features />

      {/* Mid-page marquee in dark variant */}
      <Marquee speed={20} dark items={['ONLY THE BOLD','LIMITED DROPS','INDIA\'S OWN','MAKE IT BOINNG!','STREETWEAR FIRST']} />

      {/* Instagram Feed - Social Proof */}
      <InstagramFeed />

      {/* Social proof */}
      <Testimonials />

      {/* Final CTA before footer */}
      <FinalCTA />
    </>
  );
}
