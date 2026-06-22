import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

type Category = "All" | "Fire Doors" | "Kitchens" | "Flooring" | "Wardrobes" | "Commercial" | "Refurbishments";

const categories: Category[] = ["All", "Fire Doors", "Kitchens", "Flooring", "Wardrobes", "Commercial", "Refurbishments"];

// Gallery items with gradient backgrounds representing project types
const projects = [
  { id: 1, category: "Kitchens" as Category, title: "Modern Kitchen Fit-Out", location: "Romford", size: "large",
    bg: "from-amber-900 to-stone-800", overlay: "Kitchen Installation — Romford" },
  { id: 2, category: "Fire Doors" as Category, title: "FD30 Fire Door Installation", location: "Chelmsford", size: "small",
    bg: "from-red-900 to-stone-900", overlay: "Fire Door — Chelmsford" },
  { id: 3, category: "Wardrobes" as Category, title: "Built-In Sliding Wardrobes", location: "Hornchurch", size: "small",
    bg: "from-stone-700 to-stone-900", overlay: "Wardrobes — Hornchurch" },
  { id: 4, category: "Flooring" as Category, title: "Hardwood Oak Flooring", location: "Brentwood", size: "medium",
    bg: "from-yellow-900 to-amber-950", overlay: "Oak Flooring — Brentwood" },
  { id: 5, category: "Commercial" as Category, title: "Office Fit-Out Carpentry", location: "East London", size: "large",
    bg: "from-zinc-800 to-stone-900", overlay: "Commercial — East London" },
  { id: 6, category: "Refurbishments" as Category, title: "Full Property Renovation", location: "South Woodford", size: "small",
    bg: "from-stone-600 to-stone-900", overlay: "Refurbishment — South Woodford" },
  { id: 7, category: "Kitchens" as Category, title: "Shaker Kitchen Installation", location: "Upminster", size: "small",
    bg: "from-amber-800 to-stone-900", overlay: "Kitchen — Upminster" },
  { id: 8, category: "Fire Doors" as Category, title: "Commercial Fire Door Set", location: "Basildon", size: "medium",
    bg: "from-red-950 to-zinc-900", overlay: "Fire Doors — Basildon" },
  { id: 9, category: "Flooring" as Category, title: "Engineered Wood Flooring", location: "Chingford", size: "small",
    bg: "from-yellow-950 to-stone-900", overlay: "Engineered Flooring — Chingford" },
  { id: 10, category: "Wardrobes" as Category, title: "Alcove Shelving & Storage", location: "Loughton", size: "small",
    bg: "from-stone-800 to-neutral-900", overlay: "Storage — Loughton" },
  { id: 11, category: "Commercial" as Category, title: "Reception Desk & Joinery", location: "Romford", size: "medium",
    bg: "from-neutral-700 to-zinc-900", overlay: "Commercial Joinery — Romford" },
  { id: 12, category: "Refurbishments" as Category, title: "Bathroom Renovation", location: "Epping", size: "small",
    bg: "from-slate-700 to-stone-900", overlay: "Renovation — Epping" },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [lightboxItem, setLightboxItem] = useState<typeof projects[0] | null>(null);

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="gallery" className="py-20 md:py-32 bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary font-semibold uppercase tracking-widest text-sm mb-3"
          >
            Our Work
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4"
          >
            Projects Gallery
          </motion.h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full" />
          <p className="text-muted-foreground text-lg">
            A selection of our completed projects across Essex and East London.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeCategory === cat
                  ? "bg-primary text-white border-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <LayoutGroup>
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35 }}
                  className={`relative group cursor-pointer rounded-2xl overflow-hidden border border-border/40 hover:border-primary/50 transition-all duration-300 ${
                    project.size === 'large' ? 'col-span-2 row-span-2' : project.size === 'medium' ? 'col-span-2' : ''
                  }`}
                  style={{ minHeight: project.size === 'large' ? 360 : project.size === 'medium' ? 200 : 180 }}
                  onClick={() => setLightboxItem(project)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.bg}`} />
                  {/* Wood grain texture */}
                  <div className="absolute inset-0 opacity-[0.04] bg-[repeating-linear-gradient(30deg,transparent,transparent_8px,rgba(200,155,94,0.8)_8px,rgba(200,155,94,0.8)_9px)]" />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-400 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-3 text-white text-center p-4">
                      <ZoomIn size={32} className="text-primary" />
                      <p className="font-heading font-bold text-sm">{project.title}</p>
                      <p className="text-xs text-white/70">{project.location}</p>
                    </div>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-white/10">
                    {project.category}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setLightboxItem(null)}
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative max-w-3xl w-full rounded-2xl overflow-hidden border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`h-80 bg-gradient-to-br ${lightboxItem.bg} relative`}>
                  <div className="absolute inset-0 opacity-[0.05] bg-[repeating-linear-gradient(30deg,transparent,transparent_8px,rgba(200,155,94,0.8)_8px,rgba(200,155,94,0.8)_9px)]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center p-8">
                      <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">{lightboxItem.category}</p>
                      <h3 className="font-heading font-bold text-3xl mb-2">{lightboxItem.title}</h3>
                      <p className="text-white/70">{lightboxItem.location}, Essex</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setLightboxItem(null)}
                  className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/80 transition-colors border border-white/10"
                >
                  <X size={20} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
