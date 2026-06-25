export default function CookiePolicy() {
  return (
    <section className="min-h-dvh bg-background text-foreground py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold font-heading">Cookie Policy</h1>
        <p className="text-muted-foreground">
          This Cookie Policy explains what cookies we use, why we use them, and how you can manage preferences.
        </p>

        <div className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold text-foreground">Essential Cookies</h2>
          <p>
            Required for core site operation, security, and basic functionality. These cannot be disabled.
          </p>

          <h2 className="text-xl font-semibold text-foreground">Analytics Cookies</h2>
          <p>
            Help us understand site usage and improve performance. These are only enabled with your consent.
          </p>

          <h2 className="text-xl font-semibold text-foreground">Functional Cookies</h2>
          <p>
            Store user preferences and enhance usability. These are optional and consent-based.
          </p>

          <h2 className="text-xl font-semibold text-foreground">Marketing Cookies</h2>
          <p>
            Used for ad measurement or personalization where applicable. These are optional and disabled by default.
          </p>

          <h2 className="text-xl font-semibold text-foreground">Google Search Console Note</h2>
          <p>
            Google Search Console itself is a webmaster tool and does not require marketing cookie consent by default.
            If additional Google analytics or advertising scripts are used, consent is required before activation.
          </p>

          <h2 className="text-xl font-semibold text-foreground">Manage Your Preferences</h2>
          <p>
            Use the Cookie Settings control in the footer to review or change your consent choices at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
