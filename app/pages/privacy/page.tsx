export const metadata = {
  title: 'Privacy Policy | BOINNG!',
  description: 'Read our privacy policy to understand how we collect and protect your personal data.',
};

export default function PrivacyPage() {
  return (
    <main className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 md:px-10">
        <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-tight text-boinng-black uppercase tracking-widest mb-12">
          Privacy Policy
        </h1>

        <div className="prose prose-lg max-w-none space-y-8 text-boinng-black/80">
          
          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              Introduction
            </h2>
            <p className="leading-relaxed">
              This Privacy Policy outlines how BOINNG! collects, uses, stores, and protects your personal data. By accessing or using our Services, you consent to the data practices described herein.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              Data Collection
            </h2>
            <p className="mb-4 leading-relaxed">We collect the following categories of personal information:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Identity and Contact Information:</strong> Full name, email, contact number, billing/shipping address.</li>
              <li><strong>Payment Information:</strong> Transaction details (collected securely via payment gateways).</li>
              <li><strong>Usage Data:</strong> IP address, browser type, time zone settings, and interaction with our site.</li>
              <li><strong>Cookies:</strong> We use cookies for session management, analytics, and personalized content.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              Use of Collected Information
            </h2>
            <p className="mb-4 leading-relaxed">The personal information we collect is used for:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Processing and fulfilling orders.</li>
              <li>Providing customer support.</li>
              <li>Communicating updates and promotional offers (if consented).</li>
              <li>Analyzing website performance and user behavior to improve our services.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              Data Security
            </h2>
            <p className="leading-relaxed">
              We implement reasonable administrative, technical, and physical safeguards to protect your information. However, no internet-based transmission is entirely secure.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              Data Disclosure
            </h2>
            <p className="mb-4 leading-relaxed">We do not sell, trade, or rent your personal information. Data may be disclosed only to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Payment processing services</li>
              <li>Courier/logistics providers</li>
              <li>Government authorities if mandated by law</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              User Rights
            </h2>
            <p className="mb-4 leading-relaxed">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Access, correct, or request deletion of your personal data.</li>
              <li>Withdraw consent for marketing communications.</li>
              <li>Lodge complaints with the relevant data protection authority.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              Data Retention
            </h2>
            <p className="leading-relaxed">
              Your data will be retained only for as long as necessary to fulfill the purposes outlined in this policy or as required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-boinng-black mb-4">
              Revisions to Privacy Policy
            </h2>
            <p className="leading-relaxed">
              We reserve the right to amend this Privacy Policy at our discretion. Continued use of the Services constitutes acceptance of the revised terms.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
