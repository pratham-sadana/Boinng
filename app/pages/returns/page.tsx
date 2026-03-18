export const metadata = {
  title: 'Returns & Refunds | BOINNG!',
  description: 'Learn about our hassle-free returns and refund policy.',
};

export default function ReturnsPage() {
  return (
    <main className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 md:px-10">
        <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-tight text-boinng-black uppercase tracking-widest mb-12">
          Returns & Refunds
        </h1>

        <div className="prose prose-lg max-w-none space-y-8 text-boinng-black/80">
          
          <section>
            <p className="text-lg font-medium text-boinng-black leading-relaxed">
              At BOINNG!, we want you to love every pair you receive. If something isn't quite right, we're here to help.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              No Return Policy for Worn Items
            </h2>
            <p className="leading-relaxed">
              For hygiene reasons, opened or worn socks cannot be returned or exchanged unless the product arrives damaged or defective.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              Damaged or Defective Items
            </h2>
            <p className="leading-relaxed">
              If you receive a damaged or defective item, please contact us within 48 hours of delivery with your order number and clear photos of the product. We will arrange a replacement or refund.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              Refunds
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Once we receive and inspect the returned product, your refund will be processed within 5–7 business days.</li>
              <li>Refunds will be issued to the original payment method used during purchase.</li>
              <li className="text-boinng-black/70"><em>Shipping charges are non-refundable.</em></li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              How to Request a Return
            </h2>
            <p className="leading-relaxed mb-4">
              To initiate a return, please email us at <strong>boinng.in@gmail.com</strong> with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Your order number</li>
              <li>Reason for return</li>
            </ul>
            <p className="mt-4 leading-relaxed">
              Our team will guide you through the next steps and provide shipping instructions if applicable.
            </p>
          </section>

          <section className="p-6 bg-boinng-blue/10 rounded-lg border border-boinng-blue/20">
            <h3 className="font-display text-lg font-bold uppercase tracking-wider text-boinng-black mb-3">
              Need Help?
            </h3>
            <p className="text-boinng-black/80 mb-4">
              For any questions about returns or refunds, our customer support team is here to help.
            </p>
            <a href="/pages/contact" className="inline-block px-6 py-3 bg-boinng-blue text-white rounded-full font-medium tracking-widest uppercase hover:shadow-lg transition-all">
              Contact Support
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
