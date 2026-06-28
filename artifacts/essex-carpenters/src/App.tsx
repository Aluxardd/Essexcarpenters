import { lazy, Suspense, useEffect, useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import CookiePolicy from "@/pages/CookiePolicy";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Toaster = lazy(() => import("@/components/ui/toaster").then((m) => ({ default: m.Toaster })));
const FloatingWhatsApp = lazy(() => import("@/components/FloatingWhatsApp"));
const CookieConsent = lazy(() => import("@/components/CookieConsent"));

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [loadDeferredUi, setLoadDeferredUi] = useState(false);

  useEffect(() => {
    const activateDeferredUi = () => setLoadDeferredUi(true);
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;
    const hasIdleCallback = typeof globalThis.requestIdleCallback === "function";

    if (hasIdleCallback) {
      idleId = globalThis.requestIdleCallback(activateDeferredUi, { timeout: 2000 });
    } else {
      timeoutId = globalThis.setTimeout(activateDeferredUi, 1200);
    }

    return () => {
      if (timeoutId !== null) {
        globalThis.clearTimeout(timeoutId);
      }
      if (idleId !== null && typeof globalThis.cancelIdleCallback === "function") {
        globalThis.cancelIdleCallback(idleId);
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="essex-carpenters-theme">
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <div className="min-h-dvh w-full max-w-none overflow-x-hidden flex flex-col bg-background text-foreground transition-colors duration-300">
              <Navigation />
              <main className="flex-1">
                <Router />
              </main>
              <Footer />
              {loadDeferredUi ? (
                <Suspense fallback={null}>
                  <FloatingWhatsApp />
                  <CookieConsent />
                </Suspense>
              ) : null}
            </div>
          </WouterRouter>
          {loadDeferredUi ? (
            <Suspense fallback={null}>
              <Toaster />
            </Suspense>
          ) : null}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
