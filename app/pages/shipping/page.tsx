export const metadata = {
  title: 'Shipping Info | BOINNG!',
  description: 'Learn about our shipping policies, timelines, and delivery options.',
};

export default function ShippingPage() {
  return (
    <main className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 md:px-10">
        <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-tight text-boinng-black uppercase tracking-widest mb-12">
          Shipping Information
        </h1>

        <div className="prose prose-lg max-w-none space-y-8 text-boinng-black/80">
          
          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              Serviceable Areas
            </h2>
            <p className="leading-relaxed">
              We currently ship to addresses within India using reliable third-party logistics providers.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              Processing and Dispatch Time
            </h2>
            <p className="leading-relaxed">
              Orders are processed and dispatched within 2-3 business days from the date of order confirmation and payment.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              Estimated Delivery Timelines
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Standard shipping timelines range from 5–7 business days, depending on the delivery location.</li>
              <li>Delivery may be delayed due to unforeseen circumstances beyond our control.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              Shipping Charges
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>FREE SHIPPING</strong> across India on orders above ₹799.</li>
              <li>For orders below ₹799, standard shipping fees apply (subject to change).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              Accuracy of Shipping Details
            </h2>
            <p className="leading-relaxed">
              It is the responsibility of the customer to provide accurate and complete shipping information. We shall not be held liable for any delays or failed deliveries resulting from incorrect address details.
            </p>
          </section>

          <section className="p-6 bg-boinng-bg rounded-lg border border-boinng-blue/20">
            <p className="font-medium text-boinng-black">
              Have questions about shipping? <a href="/pages/contact" className="text-boinng-blue hover:underline">Contact our support team</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
