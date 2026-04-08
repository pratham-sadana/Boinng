'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowRight } from 'lucide-react';

const FAQS = [
  {
    category: 'Payments',
    emoji: '',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept UPI, debit/credit cards, net banking, and wallets.',
      },
      {
        q: 'Can I change or cancel my order?',
        a: 'If your order hasn\'t been shipped yet, yes! Drop us a message ASAP and we\'ll try our best.',
      },
      {
        q: 'Will I get an order confirmation?',
        a: 'Of course. You\'ll get an email/SMS as soon as your order is placed.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    emoji: '',
    items: [
      {
        q: 'How long will my order take to arrive?',
        a: 'Orders are usually delivered within 3-7 working days depending on your location.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes! Orders above ₹799 ship free. Below that, it\'s a flat ₹49. Honestly just throw in one extra pair — your feet will appreciate it.',
      },
      {
        q: 'How can I track my order?',
        a: 'Once shipped, you\'ll receive a tracking link via SMS/email.',
      },
      {
        q: 'Do you ship all over India?',
        a: 'Yes! We deliver across most serviceable PIN codes in India.',
      },
    ],
  },
  {
    category: 'Returns & Exchanges',
    emoji: '',
    items: [
      {
        q: 'Can I return or exchange my socks?',
        a: 'Due to hygiene reasons socks cannot be returned or exchanged.',
      },
      {
        q: 'What if I receive a damaged or wrong product?',
        a: 'We\'ve got your back. Just send us a picture within 48 hours of delivery and we\'ll fix it ASAP.',
      },
    ],
  },
  {
    category: 'Gifting & Bulk Orders',
    emoji: '',
    items: [
      {
        q: 'Do you offer gift options?',
        a: 'Absolutely! Our bundles make a perfect gift.',
      },
      {
        q: 'Can I order in bulk?',
        a: 'Yes! Use the message box below for enquiry.',
      },
    ],
  },
  {
    category: 'Product & Care',
    emoji: '',
    items: [
      {
        q: 'What are Boinng socks made of?',
        a: 'Our socks are crafted with soft, breathable cotton to keep your feet comfy all day.',
      },
      {
        q: 'Are your socks unisex?',
        a: 'Yes! Most of our designs are made to fit and look great on everyone.',
      },
      {
        q: 'How do I choose the right size?',
        a: 'Check our size guide on the product page-it\'s super simple.',
      },
      {
        q: 'How should I wash my socks?',
        a: 'Wash inside out, use cold water, avoid harsh detergents, and air dry for longer life.',
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
  const [message, setMessage] = useState('');
  const [openItem, setOpenItem] = useState<string | null>('Payments-0');

  const toggle = (key: string) => setOpenItem(prev => prev === key ? null : key);

  const handleWhatsApp = () => {
    const text = message.trim() || 'I want to do a bulk order';
    const whatsappUrl = `https://api.whatsapp.com/send?phone=919021695191&text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

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
            FAQ
          </h1>
          <p className="text-white/45 text-sm max-w-sm mx-auto leading-relaxed">
            Everything you need to know before your next sock drop.
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
          <p className="text-white/70 text-[10px] font-black tracking-[0.3em] uppercase mb-2">Still have questions?</p>
          <h3 className="font-display text-xl uppercase tracking-widest text-white mb-2">
            We love chatting (especially about socks)
          </h3>
          <p className="text-white/60 text-sm mb-6 leading-relaxed">
            If you didn't find what you're looking for, send us a message and we'll help you out.
          </p>
          <div className="max-w-xl mx-auto rounded-xl border border-white/30 bg-white/5 p-4 text-left">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Type your message"
              className="w-full bg-transparent border border-white/30 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/60 focus:outline-none focus:border-white/70 resize-none"
            />
            <button
              type="button"
              onClick={handleWhatsApp}
              className="mt-3 inline-flex items-center gap-2 bg-[#25D366] text-black font-bold text-xs tracking-[0.2em] uppercase px-6 py-3 rounded-md hover:brightness-110 transition-all"
            >
              Message on WhatsApp
              <ArrowRight size={13} />
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}