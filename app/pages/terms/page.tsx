export const metadata = {
  title: 'Terms of Service | BOINNG!',
  description: 'Read our Terms of Service to understand the rules and agreements for using BOINNG!',
};

export default function TermsPage() {
  return (
    <main className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 md:px-10">
        <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-tight text-boinng-black uppercase tracking-widest mb-12">
          Terms of Service
        </h1>

        <div className="prose prose-lg max-w-none space-y-8 text-boinng-black/80">
          
          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              Acceptance of Terms
            </h2>
            <p className="leading-relaxed">
              By accessing and using the BOINNG! website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              Use License
            </h2>
            <p className="leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on BOINNG!'s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              Order Placement and Acceptance
            </h2>
            <p className="leading-relaxed">
              BOINNG! reserves the right to refuse or cancel any order at any time. Your order is an offer to purchase our products subject to these terms and conditions. We will confirm receipt of your order, but confirmation of receipt does not constitute acceptance of your order. We reserve the right to refuse you service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              Product Information
            </h2>
            <p className="leading-relaxed">
              We strive to provide accurate product descriptions and pricing. However, BOINNG! does not warrant that product descriptions, pricing, or other content on this website is accurate, complete, reliable, current, or error-free. Product images may not be to scale and may vary from actual product appearance.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              In no event shall BOINNG!, its suppliers, or other related parties be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the BOINNG! website.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              Modifications to Terms
            </h2>
            <p className="leading-relaxed">
              BOINNG! may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              User Conduct
            </h2>
            <p className="leading-relaxed mb-4">
              You agree not to engage in any of the following prohibited behavior:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Harassing or causing distress or inconvenience to any person</li>
              <li>Transmitting obscene or offensive content</li>
              <li>Disrupting the normal flow of dialogue within our website</li>
              <li>Attempting to gain unauthorized access to our systems</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              Intellectual Property
            </h2>
            <p className="leading-relaxed">
              All content on the BOINNG! website, including text, graphics, logos, images, and software, is the property of BOINNG! or its content suppliers and is protected by international copyright laws. The compilation, assembly, and arrangement of all content on this website is the exclusive property of BOINNG!.
            </p>
          </section>

          <section className="p-6 bg-boinng-bg rounded-lg border border-boinng-blue/20">
            <p className="font-medium text-boinng-black">
              Last Updated: March 2026. For questions about these terms, <a href="/pages/contact" className="text-boinng-blue hover:underline">contact us</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
