export default function PrivacyPolicy() {
  return (
    <section className="min-h-dvh bg-background text-foreground py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold font-heading">Privacy Policy</h1>
        <p className="text-muted-foreground">
          This Privacy Policy explains how Essex Carpenters processes personal data when you use this website.
        </p>

        <div className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold text-foreground">1. Data Controller</h2>
          <p>Essex Carpenters is the data controller for personal data collected through this website.</p>

          <h2 className="text-xl font-semibold text-foreground">2. Data We Collect</h2>
          <p>
            We may collect contact details you provide (such as name, phone number, email), project details, and
            technical information required for website security and performance.
          </p>

          <h2 className="text-xl font-semibold text-foreground">3. Purposes and Legal Basis</h2>
          <p>
            We process data to respond to enquiries, provide quotations, deliver services, and maintain website security.
            Optional analytics/marketing processing is based on consent.
          </p>

          <h2 className="text-xl font-semibold text-foreground">4. Cookies and Consent</h2>
          <p>
            Essential cookies are used for core functionality. Optional cookies (analytics, functional, marketing) are
            used only with your consent. You can change your choices at any time via Cookie Settings in the footer.
          </p>

          <h2 className="text-xl font-semibold text-foreground">5. Data Sharing</h2>
          <p>
            We may share data with trusted service providers acting on our instructions (for example hosting or analytics
            providers), subject to appropriate safeguards.
          </p>

          <h2 className="text-xl font-semibold text-foreground">6. Retention</h2>
          <p>
            Personal data is retained only as long as necessary for the purposes collected, legal obligations, and
            legitimate business records.
          </p>

          <h2 className="text-xl font-semibold text-foreground">7. Your Rights</h2>
          <p>
            Under UK GDPR, you may have rights to access, rectification, erasure, restriction, objection, and data
            portability. You may also withdraw consent at any time for consent-based processing.
          </p>

          <h2 className="text-xl font-semibold text-foreground">8. Contact</h2>
          <p>
            For privacy requests, contact: <a className="text-primary underline" href="mailto:info@essexcarpenters.co.uk">info@essexcarpenters.co.uk</a>
          </p>
        </div>
      </div>
    </section>
  );
}
