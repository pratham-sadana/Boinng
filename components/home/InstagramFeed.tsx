'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';

// Declare Instagram global for TypeScript
declare global {
  interface Window {
    instgrm: { Embeds: { process: () => void } };
  }
}

interface InstagramPost {
  id: string;
  postId: string;
  url: string;
  embedHtml?: string;
}

// Mock data - replace post IDs with real Instagram posts
// Get post URL from Instagram: instagram.com/p/{POST_ID}/ or instagram.com/reel/{REEL_ID}/
const MOCK_POSTS: InstagramPost[] = [
  {
    id: '1',
    postId: 'DVGX-YIDYvQ',
    url: 'https://www.instagram.com/reel/DVGX-YIDYvQ/?utm_source=ig_embed&utm_campaign=loading',
  },
  {
    id: '2',
    postId: 'DVVmSRqD9GI',
    url: 'https://www.instagram.com/p/DVVmSRqD9GI/?utm_source=ig_embed&utm_campaign=loading',
  },
  {
    id: '3',
    postId: 'DUXmBm0DfnE',
    url: 'https://www.instagram.com/p/DUXmBm0DfnE/?utm_source=ig_embed&utm_campaign=loading',
  },    
];

interface InstagramFeedProps {
  posts?: InstagramPost[];
  instagramHandle?: string;
}

function InstagramPostEmbed({ post }: { post: InstagramPost }) {
  useEffect(() => {
    // Load Instagram embed script
    const win = window as any;
    if (win.instgrm) {
      win.instgrm.Embeds.process();
    } else {
      const script = document.createElement('script');
      script.src = '//www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="flex justify-center rounded-2xl overflow-hidden shadow-lg"
    >
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={post.url}
        data-instgrm-version="14"
        style={{
          background: '#FFF',
          border: '0',
          borderRadius: '3px',
          boxShadow: '0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)',
          margin: '1px',
          maxWidth: '540px',
          minWidth: '326px',
          padding: '0',
          width: '99.375%',
        } as React.CSSProperties}
      />
    </motion.div>
  );
}

export function InstagramFeed({ posts = MOCK_POSTS, instagramHandle = 'boinng_' }: InstagramFeedProps) {
  return (
    <section className="py-32 bg-[#F4EFE5] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="inline-block text-boinng-blue text-sm font-bold tracking-[0.2em] uppercase mb-4">
            Follow us on Instagram
          </span>
          <h2 className="font-display text-[clamp(2.5rem,6vw,4rem)] text-boinng-black uppercase tracking-widest leading-none mb-4">
            @{instagramHandle}
          </h2>
          <p className="text-sm md:text-base font-medium tracking-wide text-black/65 max-w-2xl mx-auto mb-8">
            See how our community styles, Tag us in your posts for a chance to be featured.
          </p>

          <motion.a
            href={`https://instagram.com/${instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-3 bg-boinng-blue text-white font-bold tracking-widest uppercase rounded-full text-sm shadow-lg hover:shadow-xl hover:bg-boinng-black transition-all"
          >
            Follow Now →
          </motion.a>
        </motion.div>

        {/* Grid of posts */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
        >
          {posts.map((post) => (
            <InstagramPostEmbed key={post.id} post={post} />
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-black/60 text-sm md:text-base font-medium tracking-wide mb-6 uppercase">
            Don't see your post? Check our feed for tagged content
          </p>
          <motion.a
            href={`https://instagram.com/${instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block px-8 py-4 border-2 border-boinng-black text-boinng-black font-bold tracking-widest uppercase rounded-full hover:bg-boinng-black hover:text-white transition-colors"
          >
            View All Posts →
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

// Export mock posts for testing
export { MOCK_POSTS };
