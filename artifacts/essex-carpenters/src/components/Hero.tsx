import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const badges = [
    "First & Second Fix Carpentry",
    "Fire Door Services",
    "Kitchen Installation",
    "Flooring Installation",
    "Bespoke Storage Solutions",
    "£5M Public Liability Cover"
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
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section id="home" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-background">
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y, opacity }}
      >
        <div className="absolute inset-0 bg-black/60 dark:bg-black/70 z-10" />
        <img 
          src="/images/hero.png" 
          alt="Master Carpenter at Work" 
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      <div className="container relative z-20 px-4 md:px-6 mt-20">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.h1 
            variants={item}
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading text-white mb-6 leading-[1.1]"
          >
            Quality Carpentry & Property Improvement Services Across Essex and East London
          </motion.h1>
          
          <motion.p 
            variants={item}
            className="text-lg md:text-xl lg:text-2xl text-white/90 mb-10 max-w-3xl mx-auto font-light"
          >
            Trusted carpentry specialists with over 10 years of experience delivering high-quality workmanship for residential and commercial projects.
          </motion.p>
          
          <motion.div 
            variants={item}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-lg w-full sm:w-auto font-semibold"
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get a Free Quote
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-white border-white hover:bg-white/10 rounded-full px-8 py-6 text-lg w-full sm:w-auto font-semibold backdrop-blur-sm"
              onClick={() => document.querySelector('#gallery')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Our Work
            </Button>
          </motion.div>
          
          <motion.div 
            variants={item}
            className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 mt-8"
          >
            {badges.map((badge, index) => (
              <div key={index} className="flex items-center gap-2 text-white/90 text-sm md:text-base bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                <CheckCircle2 size={16} className="text-primary" />
                <span>{badge}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="text-white/60 text-xs uppercase tracking-widest font-semibold">Scroll</span>
        <div className="w-[1px] h-12 bg-white/20 overflow-hidden relative">
          <motion.div 
            className="w-full h-1/2 bg-primary absolute top-0"
            animate={{ 
              y: [0, 48],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 1.5,
              ease: "linear"
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
