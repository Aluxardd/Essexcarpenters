import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

const milestones = [
  { year: "2014", event: "Essex Carpenters founded by Claudiu Doca & Veaceslav Braghis" },
  { year: "2016", event: "First major commercial contract — office fit-out in Romford" },
  { year: "2018", event: "Achieved accreditation as certified fire door specialists" },
  { year: "2020", event: "Expanded team and geographic coverage across East London" },
  { year: "2024", event: "500+ completed projects across Essex and East London" }
];

const values = [
  "Turning up when we say we will",
  "Clear communication throughout",
  "Work we're proud to put our name to",
  "Residential and commercial expertise"
];

export default function About() {
  return (
    <section id="about" className="py-20 md:py-32 bg-secondary/5 overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Our Story</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-6">
              Built on Craft,<br />Driven by Pride
            </h2>
            <div className="w-20 h-1 bg-primary mb-8 rounded-full" />
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              At Essex Carpenters, we take pride in delivering high-quality carpentry work backed by over 10 years of hands-on experience in the construction industry.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Founded by Claudiu Doca and Veaceslav Braghis, we work with homeowners, landlords, businesses and contractors across Essex and East London. From fitting a single door to completing full refurbishment projects, we approach every job with professionalism, attention to detail and a commitment to quality.
            </p>
            <ul className="flex flex-col gap-3 mb-10">
              {values.map((value, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-center gap-3 text-foreground"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-medium">{value}</span>
                </motion.li>
              ))}
            </ul>
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-7 py-3.5 rounded-full hover:bg-primary/90 transition-colors"
            >
              Work With Us
              <ArrowRight size={18} />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="overflow-hidden rounded-2xl bg-card border border-border"
            >
              <div className="aspect-4/3 overflow-hidden">
                <img
                  src="/images/founders.png"
                  alt="Essex Carpenters founders"
                  className="block w-full h-full object-cover object-center scale-[1.08]"
                />
              </div>
              <div className="p-6 pt-4 text-center">
                <h3 className="font-bold font-heading text-lg">Founders</h3>
                <p className="text-sm text-muted-foreground">Claudiu Doca and Veaceslav Braghis, co-founders of Essex Carpenters</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div>
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold font-heading mb-2">Our Journey</h3>
            <div className="w-12 h-1 bg-primary mx-auto rounded-full" />
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />
            <div className="flex flex-col gap-8">
              {milestones.map((milestone, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative flex items-center gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors inline-block text-left">
                      <span className="text-primary font-bold font-heading text-xl block mb-1">{milestone.year}</span>
                      <p className="text-muted-foreground text-sm">{milestone.event}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10 shrink-0" />
                  <div className="md:w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
