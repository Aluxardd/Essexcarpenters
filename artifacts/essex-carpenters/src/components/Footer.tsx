import { Hammer, Mail, Instagram, Facebook } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Areas", href: "#areas" },
  { label: "Contact", href: "#contact" },
];

const services = [
  "First & Second Fix Carpentry",
  "Fire Door Installation",
  "Kitchen Installation",
  "Flooring Installation",
  "Fitted Wardrobes",
  "Commercial Fit-Out",
];

export default function Footer() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-card border-t border-border">
      {/* Main footer */}
      <div className="container px-4 md:px-6 mx-auto py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-5">
            <div className="bg-primary p-2 rounded-lg text-white">
              <Hammer size={22} />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">Essex Carpenters</span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Quality carpentry and property improvement services across Essex and East London. Established 2014.
          </p>
          <div className="flex items-center gap-1 text-xs font-medium bg-primary/10 border border-primary/20 text-primary rounded-full px-3 py-1.5 w-fit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Fully Insured · £5M Liability Cover
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-heading font-bold text-sm uppercase tracking-widest mb-5 text-foreground/70">Navigation</h4>
          <ul className="flex flex-col gap-3">
            {navLinks.map(link => (
              <li key={link.label}>
                <button
                  onClick={() => scrollTo(link.href)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-heading font-bold text-sm uppercase tracking-widest mb-5 text-foreground/70">Services</h4>
          <ul className="flex flex-col gap-3">
            {services.map(s => (
              <li key={s}>
                <button
                  onClick={() => scrollTo('#services')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-heading font-bold text-sm uppercase tracking-widest mb-5 text-foreground/70">Contact</h4>
          <div className="flex flex-col gap-4 mb-6">
            <a href="mailto:info@essexcarpenters.co.uk" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Mail size={16} className="text-primary shrink-0" />
              info@essexcarpenters.co.uk
            </a>
          </div>
          <div className="flex gap-3">
            <a href="#" className="p-2.5 bg-secondary rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all border border-border hover:border-primary/40">
              <Instagram size={18} />
            </a>
            <a href="#" className="p-2.5 bg-secondary rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all border border-border hover:border-primary/40">
              <Facebook size={18} />
            </a>
          </div>
          <button
            onClick={() => scrollTo('#contact')}
            className="mt-6 w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors text-sm"
          >
            Get a Free Quote
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container px-4 md:px-6 mx-auto py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Essex Carpenters. All rights reserved.</p>
          <p>Claudiu Doca & Veaceslav Braghis · Essex & East London</p>
          <p>Fully Insured · Est. 2014</p>
        </div>
      </div>
    </footer>
  );
}
