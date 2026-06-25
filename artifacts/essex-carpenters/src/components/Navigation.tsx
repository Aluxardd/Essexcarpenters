import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, Hammer } from "lucide-react";
import { Button } from "./ui/button";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Gallery", href: "#gallery" },
    { name: "Areas", href: "#areas" },
    { name: "Contact", href: "#contact" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    // If we're on the home page, scroll to the section
    if (window.location.pathname === '/') {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home and then hash
      window.location.href = `/${href}`;
    }
  };

  const topOverlay = !isScrolled;

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 relative flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group shrink-0 z-10">
          <div className="bg-primary p-2 rounded-lg text-primary-foreground group-hover:bg-primary/90 transition-colors">
            <Hammer size={24} />
          </div>
          <span className={`font-heading font-bold text-xl md:text-2xl tracking-tight transition-colors ${topOverlay ? "text-white" : "text-foreground"} group-hover:text-primary`}>
            Essex Carpenters
          </span>
        </Link>

        {/* Desktop Nav (centered) */}
        <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center">
          <ul className="flex items-center gap-7">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-sm font-medium whitespace-nowrap transition-colors ${topOverlay ? "text-white/85 hover:text-white" : "text-foreground/80 hover:text-primary"}`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop CTA (right) */}
        <div className="hidden md:flex items-center shrink-0 z-10">
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 font-semibold"
            onClick={() => {
              const element = document.querySelector('#contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Get a Free Quote
          </Button>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="flex items-center gap-4 md:hidden z-10">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 ${topOverlay ? "text-white" : "text-foreground"}`}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-background border-b shadow-lg py-4 px-4 flex flex-col gap-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block text-lg font-medium text-foreground/90 hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <Button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4"
            onClick={() => {
              setMobileMenuOpen(false);
              const element = document.querySelector('#contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Get a Free Quote
          </Button>
        </div>
      )}
    </header>
  );
}
