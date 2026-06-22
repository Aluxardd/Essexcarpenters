import { motion } from "framer-motion";
import { ArrowRight, Hammer, Shield, DoorOpen, ChefHat, Layers, Package, Wrench, Droplets, Grid3X3, Building2 } from "lucide-react";

const services = [
  {
    icon: <Hammer className="w-7 h-7" />,
    title: "First & Second Fix Carpentry",
    description: "Structural timber work, stud partitions, floor joists, roof timbers, and all framing elements that form the skeleton of your build.",
    gradient: "from-amber-900/60 to-stone-900/80",
    color: "bg-amber-950"
  },
  {
    icon: <Shield className="w-7 h-7" />,
    title: "Fire Door Installation & Inspection",
    description: "Accredited fire door specialists. Installation, inspection, and remedial works for residential and commercial compliance.",
    gradient: "from-red-950/60 to-stone-900/80",
    color: "bg-red-950"
  },
  {
    icon: <DoorOpen className="w-7 h-7" />,
    title: "Door Installation",
    description: "Internal and external door fitting with precision — bifold, pocket, French doors, and bespoke timber doorsets.",
    gradient: "from-stone-800/60 to-stone-900/80",
    color: "bg-stone-900"
  },
  {
    icon: <ChefHat className="w-7 h-7" />,
    title: "Kitchen Installation",
    description: "Full kitchen fitting and joinery — cabinets, worktops, appliance integration, and bespoke kitchen carpentry.",
    gradient: "from-amber-900/50 to-stone-900/80",
    color: "bg-amber-950"
  },
  {
    icon: <Layers className="w-7 h-7" />,
    title: "Flooring Installation",
    description: "Hardwood, engineered, and laminate flooring laid to perfection. Underfloor prep, fitting, and finishing.",
    gradient: "from-yellow-950/60 to-stone-900/80",
    color: "bg-yellow-950"
  },
  {
    icon: <Package className="w-7 h-7" />,
    title: "Fitted Wardrobes & Bespoke Storage",
    description: "Custom built-in wardrobes, alcove shelving, and bespoke storage solutions designed around your space.",
    gradient: "from-stone-700/50 to-stone-900/80",
    color: "bg-stone-800"
  },
  {
    icon: <Wrench className="w-7 h-7" />,
    title: "Property Maintenance & Multitrade",
    description: "General property maintenance covering a wide range of trades — your reliable single point of contact.",
    gradient: "from-zinc-800/60 to-stone-900/80",
    color: "bg-zinc-900"
  },
  {
    icon: <Droplets className="w-7 h-7" />,
    title: "Minor Plumbing",
    description: "Tap replacements, pipe fitting, radiator work, and minor plumbing installations handled professionally.",
    gradient: "from-blue-950/60 to-stone-900/80",
    color: "bg-blue-950"
  },
  {
    icon: <Grid3X3 className="w-7 h-7" />,
    title: "Tiling & Re-Grouting",
    description: "Bathroom and kitchen tiling, re-grouting, and wall finishing to a high standard.",
    gradient: "from-slate-800/60 to-stone-900/80",
    color: "bg-slate-900"
  },
  {
    icon: <Building2 className="w-7 h-7" />,
    title: "Commercial Fit-Out Carpentry",
    description: "Office fit-outs, shopfronts, and commercial carpentry for businesses requiring quality and reliability.",
    gradient: "from-neutral-800/60 to-stone-900/80",
    color: "bg-neutral-900"
  }
];

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-32 bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-primary font-semibold uppercase tracking-widest text-sm mb-3"
          >
            What We Do
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4"
          >
            Our Services
          </motion.h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            From structural carpentry to bespoke storage, we deliver expert workmanship across the full range of carpentry and property improvement services.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`group relative overflow-hidden rounded-2xl border border-border/50 hover:border-primary/60 transition-all duration-500 cursor-pointer ${index < 2 ? 'xl:col-span-2' : index === 2 ? 'xl:col-span-1' : ''}`}
            >
              {/* Dark background with gradient */}
              <div className={`absolute inset-0 ${service.color} bg-gradient-to-br ${service.gradient}`} />
              
              {/* Wood grain texture overlay */}
              <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(200,155,94,0.5)_10px,rgba(200,155,94,0.5)_11px)]" />

              {/* Hover glow */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
              
              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-500" />

              <div className="relative z-10 p-6 flex flex-col gap-4 min-h-[200px]">
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl w-fit text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {service.icon}
                </div>
                <div>
                  <h3 className="font-bold font-heading text-white text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-primary/0 group-hover:text-primary transition-all duration-300 mt-auto text-sm font-semibold">
                  <span>Learn more</span>
                  <ArrowRight size={14} className="translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-4 rounded-full hover:bg-primary/90 transition-colors"
          >
            Get a Free Quote for Any Service
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
