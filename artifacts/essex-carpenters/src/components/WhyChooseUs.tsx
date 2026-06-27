import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  Award, 
  Briefcase, 
  ShieldCheck, 
  ThumbsUp,
  Clock,
  Home,
  MessageSquare,
  Wrench
} from "lucide-react";

// Counter component for animation
function Counter({ end, suffix = "", duration = 2 }: { end: number, suffix?: string, duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById("stats-section");
      if (element && !hasAnimated) {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          setHasAnimated(true);
          let startTime: number;
          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initially
    return () => window.removeEventListener("scroll", handleScroll);
  }, [end, duration, hasAnimated]);

  return <span>{count}{suffix}</span>;
}

export default function WhyChooseUs() {
  const stats = [
    { value: 10, suffix: "+", label: "Years Experience", icon: <Clock className="w-6 h-6 text-primary mb-2" /> },
    { value: 500, suffix: "+", label: "Projects Completed", icon: <Briefcase className="w-6 h-6 text-primary mb-2" /> },
    { value: 100, suffix: "%", label: "Satisfaction", icon: <ThumbsUp className="w-6 h-6 text-primary mb-2" /> }
  ];

  const features = [
    { title: "Over 10 years experience", icon: <Award className="w-8 h-8 text-primary" /> },
    { title: "Residential & commercial", icon: <Home className="w-8 h-8 text-primary" /> },
    { title: "Accredited fire doors", icon: <ShieldCheck className="w-8 h-8 text-primary" /> },
    { title: "Free quotations", icon: <MessageSquare className="w-8 h-8 text-primary" /> },
    { title: "Direct communication", icon: <MessageSquare className="w-8 h-8 text-primary" /> },
    { title: "Friendly service", icon: <ThumbsUp className="w-8 h-8 text-primary" /> },
    { title: "Guaranteed quality", icon: <Wrench className="w-8 h-8 text-primary" /> }
  ];

  return (
    <section className="py-20 md:py-32 bg-secondary/5">
      <div className="container px-4 md:px-6 mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">Why Choose Essex Carpenters?</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full" />
          <p className="text-lg text-muted-foreground">
            We build relationships on trust, reliability, and exceptional craftsmanship. When you hire us, you get master carpenters who care about your property as much as you do.
          </p>
        </div>

        {/* Stats */}
        <div id="stats-section" className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 mb-20">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border p-6 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <div className="relative z-10">
                {stat.icon}
                <div className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-2 flex items-center justify-center">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex items-center gap-4 bg-card border border-border/50 p-4 rounded-xl hover:border-primary/50 transition-colors shadow-sm"
            >
              <div className="p-3 bg-secondary/10 rounded-lg">
                {feature.icon}
              </div>
              <h3 className="font-semibold font-heading text-base leading-tight">{feature.title}</h3>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
