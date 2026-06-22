import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";

const areas = [
  { name: "Romford", county: "Essex" },
  { name: "Hornchurch", county: "Essex" },
  { name: "Upminster", county: "Essex" },
  { name: "Brentwood", county: "Essex" },
  { name: "Chelmsford", county: "Essex" },
  { name: "Basildon", county: "Essex" },
  { name: "South Woodford", county: "East London" },
  { name: "Chingford", county: "East London" },
  { name: "Loughton", county: "Essex" },
  { name: "Epping", county: "Essex" },
];

export default function Areas() {
  return (
    <section id="areas" className="py-20 md:py-32 bg-secondary/5 overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Where We Work</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-6">
              Areas We Cover
            </h2>
            <div className="w-20 h-1 bg-primary mb-8 rounded-full" />
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              Based in Essex, we provide expert carpentry services throughout Essex, East London and surrounding areas.
            </p>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Whether you're a homeowner in Romford or a contractor in Chelmsford, we bring the same high standard of craftsmanship and professionalism to every project, wherever it is.
            </p>
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-7 py-3.5 rounded-full hover:bg-primary/90 transition-colors"
            >
              Get a Quote for Your Area
              <ArrowRight size={18} />
            </button>
          </motion.div>

          {/* Area Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {areas.map((area, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group relative overflow-hidden bg-card border border-border hover:border-primary/60 rounded-2xl p-5 transition-all duration-300 cursor-default"
              >
                {/* Hover accent */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-500" />

                <div className="relative z-10 flex flex-col gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-bold font-heading text-base group-hover:text-primary transition-colors">{area.name}</p>
                    <p className="text-xs text-muted-foreground">{area.county}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* "And More" card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: areas.length * 0.06 }}
              className="bg-primary/10 border border-primary/30 rounded-2xl p-5 flex flex-col justify-center items-center text-center gap-1"
            >
              <span className="text-primary text-2xl font-bold font-heading">+</span>
              <p className="text-sm font-semibold font-heading text-foreground">And surrounding areas</p>
              <p className="text-xs text-muted-foreground">Contact us to check coverage</p>
            </motion.div>
          </div>
        </div>

        {/* Coverage Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 bg-card border border-border rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-bold font-heading text-xl mb-1">Not in the list?</h3>
              <p className="text-muted-foreground">We cover more of Essex and East London — get in touch to check.</p>
            </div>
          </div>
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="shrink-0 inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary/90 transition-colors text-sm"
          >
            Check Your Area
            <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
