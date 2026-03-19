'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Heart, Globe, Sparkles } from 'lucide-react';

/* ─── tiny helpers ─── */
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── data ─── */
const VALUES = [
  {
    icon: Zap,
    title: 'No Boring Allowed',
    desc: 'Plain white socks are a crime. Every design we make has to pass one test: does it make you smile?',
    color: 'bg-boinng-yellow',
  },
  {
    icon: Globe,
    title: 'Proudly Indian',
    desc: 'Designed and made right here in India. From the yarn to the packaging, it all starts and ends at home.',
    color: 'bg-boinng-blue',
  },
  {
    icon: Heart,
    title: 'Built for Real People',
    desc: 'Not runway models. Not influencers. People who want comfy socks that also happen to be a whole vibe.',
    color: 'bg-red-400',
  },
  {
    icon: Sparkles,
    title: 'Obsessively Crafted',
    desc: 'We sweat the small stuff — thread count, elastic tension, colour fastness. Your feet will thank us.',
    color: 'bg-emerald-400',
  },
];

const PROCESS_STEPS = [
  { step: '01', title: 'The Wild Idea', desc: 'It starts with a scribble — a pattern, a character, a joke that\'s too good not to put on a sock.' },
  { step: '02', title: 'Design & Refine', desc: 'Our in-house team obsesses over colours, scale, and placement until it looks insane on a real foot.' },
  { step: '03', title: 'Made in India', desc: 'We work with local mills who\'ve been doing this for decades. Quality you can feel, made close to home.' },
  { step: '04', title: 'To Your Door', desc: 'Fresh drop, Friday. Packed with love, shipped fast. Your feet are about to have the best day.' },
];

const TEAM = [
  { name: 'Arjun Mehta', role: 'Founder & Chief Sock Officer', emoji: '🧦', fact: 'Owns 200+ pairs. Still wears them all.' },
  { name: 'Priya Nair',  role: 'Head of Design',               emoji: '🎨', fact: 'Can identify a sock pattern from 10 metres away.' },
  { name: 'Rohan Das',   role: 'Operations & Logistics',       emoji: '📦', fact: 'Has never, ever lost a shipment.' },
  { name: 'Sneha Iyer',  role: 'Community & Chaos',            emoji: '⚡', fact: 'Personally replies to every DM. Every single one.' },
];

const PRESS = [
  { outlet: 'YourStory',       quote: 'The brand making socks the most exciting thing in your wardrobe.' },
  { outlet: 'The Hindu',       quote: 'BOINNG! is proof that the best ideas are often the simplest ones.' },
  { outlet: 'Vogue India',     quote: 'Finally, Indian-made socks worth showing off.' },
  { outlet: 'Shark Tank India', quote: 'A product that makes people genuinely happy. That\'s rare.' },
];

/* ─── sections ─── */

function HeroSection() {
  return (
    <section className="relative bg-boinng-black overflow-hidden min-h-[70vh] flex items-center">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating emoji decorations */}
      {['🧦','✨','🎉','💥','🌈','🦄'].map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-4xl select-none pointer-events-none hidden md:block"
          style={{
            top:  `${15 + (i * 13) % 65}%`,
            left: i % 2 === 0 ? `${4 + i * 3}%` : undefined,
            right: i % 2 !== 0 ? `${4 + i * 3}%` : undefined,
          }}
          animate={{ y: [0, -12, 0], rotate: [-4, 4, -4] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        >
          {emoji}
        </motion.span>
      ))}

      <div className="relative max-w-[1400px] mx-auto px-4 md:px-10 py-24 md:py-32 text-center w-full">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-boinng-blue text-[10px] font-black tracking-[0.35em] uppercase mb-6"
        >
          The story of BOINNG!
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(3rem,10vw,7rem)] uppercase tracking-widest text-white leading-[0.9] mb-8"
        >
          We make socks.<br />
          <span className="text-boinng-blue">Stupid fun</span><br />
          socks.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed"
        >
          Because somewhere between getting dressed and going out, you deserve at least one thing that makes you laugh.
        </motion.p>
      </div>
    </section>
  );
}

function FounderSection() {
  return (
    <section className="py-16 md:py-24 bg-[#FFFEFA]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Image placeholder */}
          <FadeIn>
            <div className="relative rounded-3xl overflow-hidden bg-boinng-blue/10 aspect-square flex items-center justify-center">
              <span className="text-[8rem] select-none">🧦</span>
              {/* Replace with actual founder image: */}
              {/* <Image src="/images/founder.jpg" alt="Arjun Mehta" fill className="object-cover" /> */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-boinng-black/60 to-transparent p-6">
                <p className="text-white font-display text-xl uppercase tracking-widest">Arjun Mehta</p>
                <p className="text-white/60 text-xs tracking-widest uppercase">Founder & Chief Sock Officer</p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-boinng-blue text-[10px] font-black tracking-[0.3em] uppercase mb-4">Founder Story</p>
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] uppercase tracking-widest text-boinng-black leading-tight mb-6">
              It started with one<br />terrible pair of socks.
            </h2>
            <div className="space-y-4 text-black/60 text-sm md:text-base leading-relaxed">
              <p>
                In 2022, Arjun was getting dressed for a wedding and reached into his drawer to find — like every Indian man before him — a collection of sad, grey, identical socks. Something in him snapped.
              </p>
              <p>
                He spent the next three months obsessing over sock manufacturing, flying to mills, and designing patterns at 2am. His family thought he'd lost it. He had. Happily.
              </p>
              <p>
                BOINNG! launched with 6 designs and sold out in 48 hours. Now there are 50+ patterns, a team of four extremely enthusiastic people, and a growing army of happy feet across India.
              </p>
            </div>

            <div className="mt-8 inline-flex items-center gap-3 bg-boinng-black text-white px-5 py-3 rounded-full">
              <span className="text-2xl">👋</span>
              <div>
                <p className="text-xs font-black tracking-widest uppercase">Say hi</p>
                <p className="text-white/50 text-[10px]">founder@boinng.in</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  return (
    <section className="py-16 md:py-20 bg-boinng-black">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">
        <FadeIn className="mb-10 md:mb-14">
          <p className="text-boinng-blue text-[10px] font-black tracking-[0.3em] uppercase mb-3">What we stand for</p>
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] uppercase tracking-widest text-white leading-tight">
            The BOINNG! Manifesto
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <FadeIn key={v.title} delay={i * 0.08}>
                <div className="group relative rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] transition-all duration-300 p-6 h-full">
                  <div className={`w-10 h-10 rounded-xl ${v.color} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon size={18} className="text-boinng-black" />
                  </div>
                  <h3 className="font-display text-base uppercase tracking-widest text-white mb-2 leading-tight">
                    {v.title}
                  </h3>
                  <p className="text-white/45 text-xs leading-relaxed">{v.desc}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="py-16 md:py-24 bg-[#FFFEFA]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">
        <FadeIn className="mb-10 md:mb-14">
          <p className="text-boinng-blue text-[10px] font-black tracking-[0.3em] uppercase mb-3">How it happens</p>
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] uppercase tracking-widest text-boinng-black leading-tight">
            From silly idea<br />to your drawer
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-4 gap-px bg-black/[0.06] rounded-2xl overflow-hidden">
          {PROCESS_STEPS.map((s, i) => (
            <FadeIn key={s.step} delay={i * 0.08}>
              <div className="group bg-[#FFFEFA] hover:bg-boinng-blue transition-colors duration-400 p-7 md:p-8 h-full flex flex-col gap-4">
                <span className="font-display text-5xl font-bold text-boinng-blue group-hover:text-white/30 transition-colors duration-300 leading-none">
                  {s.step}
                </span>
                <div>
                  <h3 className="font-display text-base uppercase tracking-widest text-boinng-black group-hover:text-white transition-colors duration-300 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-black/50 group-hover:text-white/70 text-xs leading-relaxed transition-colors duration-300">
                    {s.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section className="py-16 md:py-20 bg-boinng-black">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">
        <FadeIn className="mb-10 md:mb-14">
          <p className="text-boinng-blue text-[10px] font-black tracking-[0.3em] uppercase mb-3">The humans</p>
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] uppercase tracking-widest text-white leading-tight">
            Meet the team
          </h2>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TEAM.map((member, i) => (
            <FadeIn key={member.name} delay={i * 0.07}>
              <div className="group rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] transition-all duration-300 p-5 text-center h-full flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                  {member.emoji}
                  {/* Replace with actual team image:
                  <Image src={`/images/team/${member.name.split(' ')[0].toLowerCase()}.jpg`} alt={member.name} width={64} height={64} className="object-cover rounded-2xl" />
                  */}
                </div>
                <div>
                  <h3 className="font-display text-sm uppercase tracking-widest text-white leading-tight mb-0.5">
                    {member.name}
                  </h3>
                  <p className="text-boinng-blue text-[9px] font-bold uppercase tracking-widest">
                    {member.role}
                  </p>
                </div>
                <p className="text-white/35 text-[10px] leading-relaxed mt-auto">
                  "{member.fact}"
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function PressSection() {
  return (
    <section className="py-16 md:py-20 bg-[#FFFEFA]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">
        <FadeIn className="mb-10 md:mb-14 text-center">
          <p className="text-boinng-blue text-[10px] font-black tracking-[0.3em] uppercase mb-3">As seen in</p>
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] uppercase tracking-widest text-boinng-black leading-tight">
            People are talking
          </h2>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESS.map((item, i) => (
            <FadeIn key={item.outlet} delay={i * 0.07}>
              <div className="group rounded-2xl border-2 border-black/[0.06] hover:border-boinng-blue bg-white hover:bg-boinng-blue/[0.03] transition-all duration-300 p-6 h-full flex flex-col justify-between gap-4">
                <p className="text-black/60 text-sm leading-relaxed italic">
                  "{item.quote}"
                </p>
                <span className="font-display text-sm uppercase tracking-widest text-boinng-blue group-hover:text-boinng-black transition-colors duration-300">
                  — {item.outlet}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="py-16 md:py-24 bg-boinng-blue overflow-hidden relative">
      {/* subtle pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <FadeIn className="relative max-w-2xl mx-auto px-4 text-center">
        <p className="text-white/60 text-[10px] font-black tracking-[0.3em] uppercase mb-4">Enough reading</p>
        <h2 className="font-display text-[clamp(2.5rem,7vw,5rem)] uppercase tracking-widest text-white leading-tight mb-6">
          Go buy<br />some socks.
        </h2>
        <p className="text-white/70 text-sm mb-10 leading-relaxed">
          Your feet have been patient long enough. New drop every Friday.
        </p>
        <Link
          href="/collections/all"
          className="group inline-flex items-center gap-2 bg-white text-boinng-blue font-bold text-xs tracking-[0.2em] uppercase px-8 py-4 rounded-full hover:bg-boinng-black hover:text-white transition-all duration-300 shadow-xl"
        >
          Shop all socks
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </FadeIn>
    </section>
  );
}

/* ─── page assembly ─── */
export function AboutPageClient() {
  return (
    <main>
      <HeroSection />
      <FounderSection />
      <ValuesSection />
      <ProcessSection />
      <TeamSection />
      <PressSection />
      <CtaSection />
    </main>
  );
}