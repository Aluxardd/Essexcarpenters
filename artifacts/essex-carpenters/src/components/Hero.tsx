import { motion, useScroll, useTransform, cubicBezier } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 180]);
  const imageY = useTransform(scrollY, [0, 1000], [-20, 90]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const imageScale = useTransform(scrollY, [0, 1000], [1.24, 1.42]);
  const base = (import.meta as any).env?.BASE_URL ?? "/";
  const withBase = (p: string) => `${base}${p.startsWith("/") ? p.slice(1) : p}`;
  const heroImageCandidates = [
    withBase("images/hero.png"),
    withBase("images/kitchen1.jpg"),
    withBase("images/commercial1.jpg"),
  ];
  const [imageIndex, setImageIndex] = useState(0);

  function handleHeroImageError() {
    setImageIndex((prev) => {
      if (prev < heroImageCandidates.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  }

  const badges = [
    "First & Second Fix Carpentry",
    "Fire Door Services",
    "Kitchen Installation",
    "Flooring Installation",
    "Bespoke Storage Solutions"
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: cubicBezier(0.16, 1, 0.3, 1) } }
  };

  return (
    <section id="home" className="relative w-full h-screen min-h-150 flex items-center justify-center overflow-hidden bg-background">
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0 w-full h-full overflow-hidden"
        style={{ opacity }}
      >
        <motion.div
          className="absolute inset-0 bg-linear-to-br from-stone-950 via-stone-900 to-amber-950"
          style={{ y }}
        />
        <motion.div
          className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_20%_30%,rgba(255,190,92,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(160,95,25,0.22),transparent_40%)]"
          style={{ y }}
        />
        <div className="absolute inset-0 bg-black/60 dark:bg-black/70 z-10" />
        <motion.img 
          src={heroImageCandidates[imageIndex]} 
          alt="Master Carpenter at Work" 
          onError={handleHeroImageError}
          style={{ y: imageY, scale: imageScale }}
          className="absolute inset-0 block w-full h-full object-cover object-[center_38%] transition-opacity duration-300 opacity-100 border-0 outline-none ring-0 rounded-none shadow-none"
        />
      </motion.div>

      <div className="container relative z-20 px-4 sm:px-6 mt-16 sm:mt-20">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.h1 
            variants={item}
            className="font-heading text-white mb-4 sm:mb-6 leading-[1.08] font-bold text-[clamp(1.45rem,5vw,3.05rem)]"
          >
            Quality Carpentry & Property Improvement Services Across Essex and East London
          </motion.h1>
          
          <motion.p 
            variants={item}
            className="font-body text-white/90 mb-7 sm:mb-10 max-w-[64ch] mx-auto font-normal text-[clamp(0.84rem,2.35vw,1.08rem)]"
          >
            Trusted carpentry specialists with over 10 years of experience delivering high-quality workmanship for residential and commercial projects.
          </motion.p>
          
          <motion.div 
            variants={item}
            className="hero-compact-actions flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-9 sm:mb-12"
          >
            <Button 
              size="lg" 
              className="hero-compact-btn bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 sm:px-8 py-4 sm:py-6 text-[clamp(0.82rem,1.95vw,0.92rem)] w-full sm:w-auto font-body font-semibold"
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get a Free Quote
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="hero-compact-btn text-white border-white hover:bg-white/10 rounded-full px-6 sm:px-8 py-4 sm:py-6 text-[clamp(0.82rem,1.95vw,0.92rem)] w-full sm:w-auto font-body font-semibold backdrop-blur-sm"
              onClick={() => document.querySelector('#gallery')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Our Work
            </Button>
          </motion.div>
          
          <motion.div 
            variants={item}
            className="hero-compact-badges flex flex-wrap justify-center items-center gap-x-3 sm:gap-x-5 gap-y-2.5 sm:gap-y-3 mt-5 sm:mt-8"
          >
            {badges.map((badge, index) => (
              <div key={index} className="hero-compact-badge flex items-center gap-1.5 sm:gap-2 text-white/90 font-body text-[clamp(0.62rem,1.55vw,0.8rem)] bg-black/30 px-2.5 sm:px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                <CheckCircle2 size={16} className="text-primary" />
                <span>{badge}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
