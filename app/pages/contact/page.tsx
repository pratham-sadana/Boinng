import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | BOINNG!',
  description: 'Get in touch with the BOINNG! team. We\'re here to help with any questions about our socks.',
};

export default function ContactPage() {
  return (
    <main className="pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">
        
        {/* Header */}
        <div className="mb-16">
          <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-tight text-boinng-black uppercase tracking-widest mb-6">
            Get In Touch
          </h1>
          <p className="font-medium text-base text-boinng-black/70 max-w-2xl">
            Have questions about our socks or need support? We're here to help. Reach out to the BOINNG! team and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 border border-black/10 rounded-2xl bg-boinng-bg">
            <Mail className="w-8 h-8 text-boinng-blue mb-4" />
            <h3 className="font-display text-lg font-bold uppercase tracking-wider mb-2">Email Us</h3>
            <a href="mailto:support@boinng.co" className="text-boinng-blue hover:underline">
              support@boinng.co
            </a>
          </div>

          <div className="p-8 border border-black/10 rounded-2xl bg-boinng-bg">
            <Phone className="w-8 h-8 text-boinng-blue mb-4" />
            <h3 className="font-display text-lg font-bold uppercase tracking-wider mb-2">Call Us</h3>
            <a href="tel:+919876543210" className="text-boinng-blue hover:underline">
              +91 9876 543 210
            </a>
          </div>

          <div className="p-8 border border-black/10 rounded-2xl bg-boinng-bg">
            <MapPin className="w-8 h-8 text-boinng-blue mb-4" />
            <h3 className="font-display text-lg font-bold uppercase tracking-wider mb-2">Visit Us</h3>
            <p className="text-boinng-black/70">
              Mumbai, India
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-wider mb-8">Send Us A Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="text" 
                placeholder="Your Name" 
                className="px-6 py-4 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-boinng-blue"
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                className="px-6 py-4 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-boinng-blue"
              />
            </div>
            <input 
              type="text" 
              placeholder="Subject" 
              className="w-full px-6 py-4 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-boinng-blue"
            />
            <textarea 
              placeholder="Your Message" 
              rows={6}
              className="w-full px-6 py-4 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-boinng-blue"
            />
            <button 
              type="submit"
              className="px-8 py-4 bg-boinng-blue text-white rounded-full font-display font-medium tracking-widest uppercase hover:shadow-lg transition-all"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
