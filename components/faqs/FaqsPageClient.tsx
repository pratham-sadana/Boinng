'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Plus, ArrowRight } from 'lucide-react';

const FAQS = [
  {
    category: 'Orders & Shipping',
    emoji: '📦',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Most orders arrive within 4–7 business days across India. Metro cities are usually faster — 2–4 days. We\'ll send you a tracking link the moment your socks leave our hands.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes! Orders above ₹799 ship free. Below that, it\'s a flat ₹49. Honestly just throw in one extra pair — your feet will appreciate it.',
      },
      {
        q: 'Can I change or cancel my order?',
        a: 'If your order hasn\'t been packed yet, absolutely. Drop us a message at orders@boinng.in within 2 hours of placing it and we\'ll sort it out.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Not yet — but we\'re working on it! Sign up to our newsletter and we\'ll shout when international shipping goes live.',
      },
    ],
  },
  {
    category: 'Returns & Exchanges',
    emoji: '🔄',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 7 days of delivery, as long as the socks are unworn and in original packaging. We know, we know — it\'s hard to resist trying them on.',
      },
      {
        q: 'My order arrived damaged. What do I do?',
        a: 'That\'s on us and we\'re sorry. Take a photo and email it to hello@boinng.in — we\'ll send a replacement or refund within 24 hours. No questions asked.',
      },
      {
        q: 'Can I exchange for a different size?',
        a: 'Yes! Reply to your order confirmation email with your exchange request and we\'ll guide you through it. Exchanges are free if the original order was above ₹799.',
      },
    ],
  },
  {
    category: 'Product & Sizing',
    emoji: '🧦',
    items: [
      {
        q: 'What sizes do you offer?',
        a: 'We carry Free Size (fits UK 6–10) and Large (fits UK 10–13). If you\'re between sizes, go larger — socks stretch but they don\'t shrink.',
      },
      {
        q: 'What are your socks made of?',
        a: 'Our socks are 80% combed cotton, 15% nylon, and 5% elastane. Soft, breathable, and built to last — even after your washing machine does its worst.',
      },
      {
        q: 'How do I wash my BOINNG! socks?',
        a: 'Machine wash cold, inside out, with similar colours. Skip the bleach and the dryer if you want the colours to stay as loud as the day you bought them.',
      },
      {
        q: 'Will the colours fade?',
        a: 'We use high-grade reactive dyes specifically to resist fading. Wash correctly and your socks will outlast most of your other clothes. Possibly your relationships too.',
      },
    ],
  },
  {
    category: 'Payments',
    emoji: '💳',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'UPI, credit/debit cards, net banking, and all major wallets. We also offer Cash on Delivery for orders up to ₹2,000.',
      },
      {
        q: 'Is my payment information safe?',
        a: 'All payments are processed via Razorpay and Shopify Payments — both PCI-DSS compliant. We never store your card details.',
      },
      {
        q: 'Do you offer EMI?',
        a: 'EMI is available on credit cards for orders above ₹1,500. You\'ll see the option at checkout.',
      },
    ],
  },
];

function AccordionItem({ q, a, isOpen, onToggle }: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`border-b border-black/[0.07] transition-colors duration-200 ${isOpen ? 'bg-boinng-blue/[0.03]' : 'bg-transparent'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 px-5 md:px-6 text-left group"
        aria-expanded={isOpen}
      >
        <span className={`font-display text-sm md:text-base uppercase tracking-widest leading-snug transition-colors duration-200 ${isOpen ? 'text-boinng-blue' : 'text-boinng-black group-hover:text-boinng-blue'}`}>
          {q}
        </span>
        <span className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 mt-0.5 ${isOpen ? 'bg-boinng-blue border-boinng-blue rotate-45' : 'border-black/20 group-hover:border-boinng-blue'}`}>
          <Plus size={12} className={`transition-colors duration-200 ${isOpen ? 'text-white' : 'text-black/40 group-hover:text-boinng-blue'}`} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 md:px-6 pb-5 text-black/55 text-sm leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqsPageClient() {
  const [openItem, setOpenItem] = useState<string | null>('Orders & Shipping-0');

  const toggle = (key: string) => setOpenItem(prev => prev === key ? null : key);

  return (
    <main className="bg-[#FFFEFA] min-h-screen">

      {/* Hero */}
      <section className="bg-boinng-black pt-16 pb-14 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <p className="text-boinng-blue text-[10px] font-black tracking-[0.35em] uppercase mb-4">Help Centre</p>
          <h1 className="font-display text-[clamp(2.5rem,8vw,5.5rem)] uppercase tracking-widest text-white leading-tight mb-3">
            Got questions?
          </h1>
          <p className="text-white/45 text-sm max-w-sm mx-auto leading-relaxed">
            We've got answers. And if we don't, we'll make something up. (Kidding. Mostly.)
          </p>
        </motion.div>
      </section>

      {/* FAQ sections */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-14 md:py-20 space-y-12">
        {FAQS.map((section, si) => (
          <motion.div
            key={section.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: si * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Category header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{section.emoji}</span>
              <h2 className="font-display text-xs uppercase tracking-[0.25em] text-black/40">
                {section.category}
              </h2>
            </div>

            {/* Accordion */}
            <div className="rounded-2xl border border-black/[0.07] overflow-hidden bg-white shadow-sm">
              {section.items.map((item, ii) => (
                <AccordionItem
                  key={item.q}
                  q={item.q}
                  a={item.a}
                  isOpen={openItem === `${section.category}-${ii}`}
                  onToggle={() => toggle(`${section.category}-${ii}`)}
                />
              ))}
            </div>
          </motion.div>
        ))}

        {/* Still need help */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-boinng-blue p-8 text-center"
        >
          <p className="text-white/70 text-[10px] font-black tracking-[0.3em] uppercase mb-2">Still confused?</p>
          <h3 className="font-display text-xl uppercase tracking-widest text-white mb-2">
            We're real humans. Promise.
          </h3>
          <p className="text-white/60 text-sm mb-6 leading-relaxed">
            Drop us a message and we'll get back to you within a few hours.
          </p>
          <Link
            href="mailto:boinng.in@gmail.com"
            className="group inline-flex items-center gap-2 bg-white text-boinng-blue font-bold text-xs tracking-[0.2em] uppercase px-6 py-3 rounded-full hover:bg-boinng-black hover:text-white transition-all duration-300"
          >
            Email us
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}