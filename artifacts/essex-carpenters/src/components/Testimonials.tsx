import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    location: "Romford",
    project: "Kitchen Installation",
    rating: 5,
    quote: "Absolutely outstanding work. Claudiu and his team installed our new kitchen and the result exceeded every expectation. Precise, tidy and professional from start to finish. We wouldn't hesitate to recommend Essex Carpenters."
  },
  {
    name: "James T.",
    location: "Chelmsford",
    project: "Fire Door Installation",
    rating: 5,
    quote: "Required fire doors installed throughout our commercial property. The team arrived on time, worked cleanly and efficiently, and provided all the compliance documentation we needed. Excellent service and fair pricing."
  },
  {
    name: "Rachel P.",
    location: "Hornchurch",
    project: "Fitted Wardrobes",
    rating: 5,
    quote: "Our built-in wardrobes are absolutely beautiful. Veaceslav took the time to understand exactly what we wanted and delivered something even better. The finish is immaculate. We've already booked them for our next project."
  },
  {
    name: "Mark D.",
    location: "Brentwood",
    project: "Hardwood Flooring",
    rating: 5,
    quote: "The guys fitted engineered oak throughout our ground floor and it looks incredible. They were respectful of our home, cleaned up after themselves and the work is to an exceptional standard. Highly recommended."
  },
  {
    name: "Linda K.",
    location: "Upminster",
    project: "Property Maintenance",
    rating: 4,
    quote: "Used Essex Carpenters for a range of jobs around the house — doors, shelving, and minor plumbing. Every job was done well and the communication was excellent. It's rare to find a team this reliable."
  },
  {
    name: "Chris B.",
    location: "South Woodford",
    project: "Office Fit-Out",
    rating: 5,
    quote: "We hired Essex Carpenters for a full commercial fit-out. The quality of carpentry throughout our office is something we're genuinely proud to show clients. Professional, timely and great value."
  }
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={star <= rating ? "fill-primary text-primary" : "fill-muted text-muted"}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const go = (dir: number) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background wood texture */}
      <div className="absolute inset-0 opacity-[0.02] bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(200,155,94,0.5)_20px,rgba(200,155,94,0.5)_21px)]" />

      <div className="container px-4 md:px-6 mx-auto relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary font-semibold uppercase tracking-widest text-sm mb-3"
          >
            What Clients Say
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4"
          >
            Client Reviews
          </motion.h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>

        {/* Main testimonial */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative min-h-[280px] flex items-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center"
              >
                <div className="bg-card border border-border rounded-3xl p-8 md:p-12 w-full relative overflow-hidden">
                  {/* Quote mark */}
                  <div className="absolute top-6 right-8 text-8xl font-serif text-primary/10 leading-none select-none">"</div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary font-bold font-heading">
                      {testimonials[current].name[0]}
                    </div>
                    <div>
                      <p className="font-bold font-heading text-lg">{testimonials[current].name}</p>
                      <p className="text-sm text-muted-foreground">{testimonials[current].location} · {testimonials[current].project}</p>
                    </div>
                    <div className="ml-auto">
                      <StarRating rating={testimonials[current].rating} />
                    </div>
                  </div>

                  <blockquote className="text-lg md:text-xl text-foreground leading-relaxed italic">
                    "{testimonials[current].quote}"
                  </blockquote>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => go(-1)}
            className="p-3 rounded-full border border-border hover:border-primary/60 hover:bg-primary/10 transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? "w-8 h-2.5 bg-primary" : "w-2.5 h-2.5 bg-border hover:bg-primary/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => go(1)}
            className="p-3 rounded-full border border-border hover:border-primary/60 hover:bg-primary/10 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Mini cards below */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 opacity-60">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={`bg-card border rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                i === current ? "border-primary opacity-100" : "border-border hover:border-primary/40"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">{t.name[0]}</div>
                <div>
                  <p className="text-xs font-semibold font-heading">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.project}</p>
                </div>
              </div>
              <StarRating rating={t.rating} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
