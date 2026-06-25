import { useState, type SyntheticEvent } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

type Category = "All" | "Fire Doors" | "Kitchens" | "Flooring" | "Wardrobes" | "Commercial" | "Refurbishments";

const categories: Category[] = ["All", "Fire Doors", "Kitchens", "Flooring", "Wardrobes", "Commercial", "Refurbishments"];

// Preferred image filenames per category (user-renamed assets). These will be used when available.
// Files should be placed in artifacts/essex-carpenters/public/images

// Prefix helper that respects Vite's base path (so assets also work under subpaths)
function withBase(p: string) {
  const base = (import.meta as any).env?.BASE_URL ?? "/";
  const clean = p.startsWith("/") ? p.slice(1) : p;
  return `${base}${clean}`;
}

const categoryImageCandidates: Record<Exclude<Category, "All">, string[]> = {
  "Fire Doors": [withBase("images/firedoor1.png")],
  "Kitchens": [withBase("images/kitchen1.png")],
  "Flooring": [withBase("images/flooring1.png")],
  "Wardrobes": [withBase("images/wardrobe1.png")],
  // Per your request, leave Commercial and Refurbishments as-is (use the legacy service-*.png images)
};

function getCandidatesForCategory(category: Category): string[] {
  if (category === "All") return [];
  return categoryImageCandidates[category as Exclude<Category, "All">] || [];
}

function getImageForCategory(category: Category, fallback: string) {
  const candidates = getCandidatesForCategory(category);
  return candidates[0] ?? fallback;
}

// Tiny transparent PNG (1x1) as a last-resort fallback to avoid broken image icon
const TRANSPARENT_PX =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";

// Enhanced onError handler: try a list of candidate filenames first, then the legacy fallback, then a transparent pixel
function handleErrorWithCandidates(e: SyntheticEvent<HTMLImageElement, Event>) {
  const img = e.currentTarget as HTMLImageElement;

  // Parse remaining candidates from data attribute
  const raw = img.dataset.candidates || "";
  const candidates = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  let idx = Number(img.dataset.candidateIndex || 0);

  // Try next candidate if available
  if (idx < candidates.length) {
    const next = candidates[idx];
    img.dataset.candidateIndex = String(idx + 1);
    if (img.src !== next) {
      img.src = next;
      return;
    }
  }

  // Try legacy fallback once
  const legacy = img.dataset.legacyFallback;
  const triedLegacy = img.dataset.triedLegacy === "1";
  if (legacy && !triedLegacy) {
    img.dataset.triedLegacy = "1";
    if (img.src !== legacy) {
      img.src = legacy;
      return;
    }
  }

  // Last resort: transparent pixel to avoid broken icon
  if (img.src !== TRANSPARENT_PX) {
    img.src = TRANSPARENT_PX;
    if (import.meta.env.DEV) {
      console.warn("Gallery image missing; used transparent fallback for:", img.alt || img.currentSrc);
    }
  }
}

// Gallery items mapped to real images in public/images
// Note: Using Vite public folder paths like "/images/..." for optimal performance (no bundling of large assets).
const projects = [
  { id: 1, category: "Kitchens" as Category, title: "Modern Kitchen Fit-Out", location: "Romford", size: "large",
    image: withBase("images/service-1.png"), alt: "Modern kitchen installation in Romford", bg: "from-amber-900 to-stone-800", overlay: "Kitchen Installation — Romford" },
  { id: 2, category: "Fire Doors" as Category, title: "FD30 Fire Door Installation", location: "Chelmsford", size: "small",
    image: withBase("images/service-4.png"), alt: "Fire door installation in Chelmsford", bg: "from-red-900 to-stone-900", overlay: "Fire Door — Chelmsford" },
  { id: 3, category: "Wardrobes" as Category, title: "Built-In Sliding Wardrobes", location: "Hornchurch", size: "small",
    image: withBase("images/service-2.png"), alt: "Built-in sliding wardrobes in Hornchurch", bg: "from-stone-700 to-stone-900", overlay: "Wardrobes — Hornchurch" },
  { id: 4, category: "Flooring" as Category, title: "Hardwood Oak Flooring", location: "Brentwood", size: "medium",
    image: withBase("images/service-3.png"), alt: "Hardwood oak flooring in Brentwood", bg: "from-yellow-900 to-amber-950", overlay: "Oak Flooring — Brentwood" },
  { id: 5, category: "Commercial" as Category, title: "Office Fit-Out Carpentry", location: "East London", size: "large",
    image: withBase("images/service-5.png"), alt: "Commercial office carpentry in East London", bg: "from-zinc-800 to-stone-900", overlay: "Commercial — East London" },
  { id: 6, category: "Refurbishments" as Category, title: "Full Property Renovation", location: "South Woodford", size: "small",
    image: withBase("images/service-6.png"), alt: "Property refurbishment in South Woodford", bg: "from-stone-600 to-stone-900", overlay: "Refurbishment — South Woodford" },
  { id: 7, category: "Kitchens" as Category, title: "Shaker Kitchen Installation", location: "Upminster", size: "small",
    image: withBase("images/service-1.png"), alt: "Shaker kitchen in Upminster", bg: "from-amber-800 to-stone-900", overlay: "Kitchen — Upminster" },
  { id: 8, category: "Fire Doors" as Category, title: "Commercial Fire Door Set", location: "Basildon", size: "medium",
    image: withBase("images/service-4.png"), alt: "Commercial fire doors in Basildon", bg: "from-red-950 to-zinc-900", overlay: "Fire Doors — Basildon" },
  { id: 9, category: "Flooring" as Category, title: "Engineered Wood Flooring", location: "Chingford", size: "small",
    image: withBase("images/service-3.png"), alt: "Engineered wood flooring in Chingford", bg: "from-yellow-950 to-stone-900", overlay: "Engineered Flooring — Chingford" },
  { id: 10, category: "Wardrobes" as Category, title: "Alcove Shelving & Storage", location: "Loughton", size: "small",
    image: withBase("images/service-2.png"), alt: "Alcove shelving and storage in Loughton", bg: "from-stone-800 to-neutral-900", overlay: "Storage — Loughton" },
  { id: 11, category: "Commercial" as Category, title: "Reception Desk & Joinery", location: "Romford", size: "medium",
    image: withBase("images/service-5.png"), alt: "Reception desk joinery in Romford", bg: "from-neutral-700 to-zinc-900", overlay: "Commercial Joinery — Romford" },
  { id: 12, category: "Refurbishments" as Category, title: "Bathroom Renovation", location: "Epping", size: "small",
    image: withBase("images/service-6.png"), alt: "Bathroom renovation in Epping", bg: "from-slate-700 to-stone-900", overlay: "Renovation — Epping" },
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
                  {/* Image */}
                  <img
                    src={getImageForCategory(project.category, project.image)}
                    alt={project.alt}
                    loading="lazy"
                    data-candidates={getCandidatesForCategory(project.category).join(",")}
                    data-legacy-fallback={project.image}
                    onError={handleErrorWithCandidates}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Subtle tinted gradient over image */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.bg} opacity-60 mix-blend-multiply`} />

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
                <div className="relative bg-black">
                  <img
                    src={getImageForCategory(lightboxItem.category, lightboxItem.image)}
                    alt={lightboxItem.alt}
                    data-candidates={getCandidatesForCategory(lightboxItem.category).join(",")}
                    data-legacy-fallback={lightboxItem.image}
                    onError={handleErrorWithCandidates}
                    className="w-full h-auto max-h-[70vh] object-contain bg-black"
                  />
                  {/* Caption overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/0 p-6 text-white">
                    <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-1">{lightboxItem.category}</p>
                    <h3 className="font-heading font-bold text-xl md:text-2xl">{lightboxItem.title}</h3>
                    <p className="text-white/70 text-sm">{lightboxItem.location}, Essex</p>
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
