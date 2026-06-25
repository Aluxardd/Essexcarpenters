import { useEffect, useMemo, useState } from "react";

type CookieConsentState = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  timestamp: string;
  version: number;
};

const STORAGE_KEY = "essex-carpenters-cookie-consent-v1";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function readStoredConsent(): CookieConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentState;
    if (
      parsed &&
      parsed.essential === true &&
      typeof parsed.analytics === "boolean" &&
      typeof parsed.marketing === "boolean" &&
      typeof parsed.functional === "boolean"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function applyGoogleConsent(consent: CookieConsentState) {
  if (typeof window.gtag !== "function") return;

  window.gtag("consent", "update", {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: consent.marketing ? "granted" : "denied",
    functionality_storage: consent.functional ? "granted" : "denied",
    security_storage: "granted",
  });
}

function persistConsent(consent: CookieConsentState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  applyGoogleConsent(consent);
  window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: consent }));
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [functional, setFunctional] = useState(false);

  const currentConsent = useMemo<CookieConsentState>(
    () => ({
      essential: true,
      analytics,
      marketing,
      functional,
      timestamp: new Date().toISOString(),
      version: 1,
    }),
    [analytics, marketing, functional],
  );

  useEffect(() => {
    const stored = readStoredConsent();
    if (!stored) {
      setShowBanner(true);
      if (typeof window.gtag === "function") {
        window.gtag("consent", "default", {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          functionality_storage: "denied",
          security_storage: "granted",
        });
      }
      return;
    }

    setAnalytics(stored.analytics);
    setMarketing(stored.marketing);
    setFunctional(stored.functional);
    applyGoogleConsent(stored);
  }, []);

  useEffect(() => {
    const onOpenPrefs = () => {
      const stored = readStoredConsent();
      if (stored) {
        setAnalytics(stored.analytics);
        setMarketing(stored.marketing);
        setFunctional(stored.functional);
      }
      setShowPreferences(true);
      setShowBanner(true);
    };

    window.addEventListener("open-cookie-preferences", onOpenPrefs);
    return () => window.removeEventListener("open-cookie-preferences", onOpenPrefs);
  }, []);

  const acceptAll = () => {
    const consent: CookieConsentState = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: new Date().toISOString(),
      version: 1,
    };
    persistConsent(consent);
    setAnalytics(true);
    setMarketing(true);
    setFunctional(true);
    setShowPreferences(false);
    setShowBanner(false);
  };

  const rejectOptional = () => {
    const consent: CookieConsentState = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: new Date().toISOString(),
      version: 1,
    };
    persistConsent(consent);
    setAnalytics(false);
    setMarketing(false);
    setFunctional(false);
    setShowPreferences(false);
    setShowBanner(false);
  };

  const savePreferences = () => {
    persistConsent(currentConsent);
    setShowPreferences(false);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-4 left-1/2 z-120 w-[min(96vw,900px)] -translate-x-1/2 rounded-2xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur-md md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-foreground">We Value Your Privacy</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground md:text-sm">
              We use essential cookies to run the website and optional cookies for analytics, functionality, and
              marketing. You can update your choices anytime in Cookie Settings.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:justify-end">
            <button
              onClick={() => setShowPreferences(true)}
              className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent/40 md:text-sm"
            >
              Manage Settings
            </button>
            <button
              onClick={rejectOptional}
              className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent/40 md:text-sm"
            >
              Reject
            </button>
            <button
              onClick={acceptAll}
              className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 md:text-sm"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>

      {showPreferences && (
        <div className="fixed inset-0 z-130 flex items-center justify-center bg-black/60 p-4">
          <div className="w-[min(95vw,620px)] rounded-2xl border border-border bg-card p-5 shadow-2xl md:p-6">
            <h3 className="text-lg font-bold text-foreground">Cookie Preferences</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose which optional cookies you want to allow. Essential cookies are always active.
            </p>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Essential</p>
                  <p className="text-xs text-muted-foreground">Required for core site functionality and security.</p>
                </div>
                <span className="rounded bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground">Always On</span>
              </div>

              <label className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Analytics</p>
                  <p className="text-xs text-muted-foreground">Helps us measure performance and improve the site.</p>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Functional</p>
                  <p className="text-xs text-muted-foreground">Remembers preferences for a smoother browsing experience.</p>
                </div>
                <input
                  type="checkbox"
                  checked={functional}
                  onChange={(e) => setFunctional(e.target.checked)}
                  className="h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Marketing</p>
                  <p className="text-xs text-muted-foreground">Used for advertising and conversion measurement.</p>
                </div>
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="h-4 w-4"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                onClick={rejectOptional}
                className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent/40"
              >
                Reject
              </button>
              <button
                onClick={savePreferences}
                className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
