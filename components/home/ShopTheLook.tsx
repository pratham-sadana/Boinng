'use client';

import { motion, Variants } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { QuickAddModal } from '@/components/product/QuickAddModal';
import { useCart } from '@/lib/cart/context';
import { TransformedProduct } from '@/lib/shopify/types';

interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  product: TransformedProduct;
}

interface ShopTheLookProps {
  title: string;
  description?: string;
  backgroundImage: string;
  hotspots: Hotspot[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 10 }
  }
};

export function ShopTheLook({ title, description, backgroundImage, hotspots }: ShopTheLookProps) {
  const [selectedProduct, setSelectedProduct] = useState<Hotspot | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const { addItem } = useCart();

  return (
    <section className="py-32 bg-[#FFFEFA] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-[clamp(2.5rem,6vw,4rem)] text-boinng-black uppercase tracking-widest leading-none mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-sm md:text-base font-medium tracking-wide text-boinng-black/60 max-w-2xl mx-auto mb-8 leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>

        {/* Main Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, type: 'spring', bounce: 0.4 }}
          className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start mb-16"
        >
          {/* Image with hotspots */}
          <div className="relative aspect-[3/4] md:aspect-auto md:h-96 lg:h-full group">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg bg-black/5">
              {backgroundImage ? (
                <Image
                  src={backgroundImage}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-black/10 flex items-center justify-center">
                  <span className="text-black/30 font-display uppercase">Loading...</span>
                </div>
              )}

              {/* Hotspot overlays */}
              {hotspots.map((hotspot) => (
                <motion.button
                  key={hotspot.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                  onMouseEnter={() => setHoveredHotspot(hotspot.id)}
                  onMouseLeave={() => setHoveredHotspot(null)}
                  onClick={() => setSelectedProduct(hotspot)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute w-10 h-10 border-2 border-boinng-blue rounded-full"
                    animate={hoveredHotspot === hotspot.id ? { scale: 1.5, opacity: 0 } : { scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />

                  {/* Center dot */}
                  <motion.div
                    className="w-6 h-6 bg-boinng-blue rounded-full flex items-center justify-center text-white text-xs font-bold"
                    animate={hoveredHotspot === hotspot.id ? { scale: 1.2 } : { scale: 1 }}
                  >
                    +
                  </motion.div>

                  {/* Label tooltip on hover */}
                  {hoveredHotspot === hotspot.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute bottom-full mb-2 -left-24 w-48 bg-boinng-black text-white p-3 rounded-lg text-xs font-bold tracking-widest uppercase whitespace-normal text-center"
                    >
                      {hotspot.product.title}
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Products List */}
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="space-y-4">
              {hotspots.map((hotspot) => (
                <motion.div
                  key={hotspot.id}
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                  className="flex gap-4 p-4 rounded-lg border border-black/10 hover:border-boinng-blue/50 hover:bg-boinng-blue/5 transition-all cursor-pointer group"
                  onClick={() => setSelectedProduct(hotspot)}
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-black/5 relative">
                    {hotspot.product.image?.url ? (
                      <Image
                        src={hotspot.product.image.url}
                        alt={hotspot.product.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-black/10 flex items-center justify-center">
                        <span className="text-xs text-black/30">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-sm uppercase tracking-widest text-boinng-black group-hover:text-boinng-blue transition-colors">
                        {hotspot.product.title}
                      </p>
                      <p className="text-xs text-boinng-black/60 mt-1 line-clamp-2">
                        {hotspot.product.description}
                      </p>
                    </div>
                    <p className="font-bold text-boinng-black">
                      ₹{hotspot.product.price}
                    </p>
                  </div>

                  {/* Quick Add Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hotspot.product.variants.length === 1) {
                        addItem({
                          id: hotspot.product.variants[0].id,
                          title: hotspot.product.title,
                          quantity: 1,
                          price: parseFloat(hotspot.product.variants[0].price.amount),
                          image: hotspot.product.image?.url || '/logos/cropped.png',
                        });
                      } else {
                        setSelectedProduct(hotspot);
                      }
                    }}
                    className="flex-shrink-0 px-4 py-2 bg-boinng-black text-white rounded-full text-xs font-bold tracking-widest uppercase hover:bg-boinng-blue transition-colors"
                  >
                    ADD
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Add Modal */}
        {selectedProduct && (
          <QuickAddModal
            product={selectedProduct.product}
            isOpen={selectedProduct !== null}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </section>
  );
}

// Example component showing how to use ShopTheLook
export function ShopTheLookExample() {
  // This would normally come from Shopify API
  const exampleHotspots: Hotspot[] = [
    {
      id: '1',
      x: 35,
      y: 30,
      product: {
        id: '1',
        title: 'BOLD TEE',
        handle: 'bold-tee',
        description: 'Premium cotton tee with statement print',
        price: '₹999',
        featuredImage: { url: 'https://via.placeholder.com/400', alt: 'Bold Tee', width: 400, height: 400 },
        variants: [
          {
            id: '1',
            title: 'M',
            price: { amount: '999', currencyCode: 'INR' },
            compareAtPrice: null,
            image: { url: 'https://via.placeholder.com/400', alt: 'Bold Tee' }
          }
        ],
        images: [],
      } as any,
    },
    {
      id: '2',
      x: 65,
      y: 60,
      product: {
        id: '2',
        title: 'TRACK PANTS',
        handle: 'track-pants',
        description: 'Comfortable joggers for streetwear vibes',
        price: '₹1,499',
        featuredImage: { url: 'https://via.placeholder.com/400', alt: 'Track Pants', width: 400, height: 400 },
        variants: [
          {
            id: '2',
            title: 'M',
            price: { amount: '1499', currencyCode: 'INR' },
            compareAtPrice: null,
            image: { url: 'https://via.placeholder.com/400', alt: 'Track Pants' }
          }
        ],
        images: [],
      } as any,
    },
  ];

  return (
    <ShopTheLook
      title="Shop the Look"
      description="Tap the hotspots or browse the products below to complete your streetwear fit."
      backgroundImage="https://via.placeholder.com/800x1000"
      hotspots={exampleHotspots}
    />
  );
}
