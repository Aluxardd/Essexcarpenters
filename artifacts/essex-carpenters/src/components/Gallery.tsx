import { useEffect, useMemo, useRef, useState, type SyntheticEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

type Category = "All" | "FD30/60 Fire Door Installations" | "Kitchens" | "Flooring" | "Wardrobes" | "Commercial" | "Refurbishments";

const categories: Category[] = ["All", "FD30/60 Fire Door Installations", "Kitchens", "Flooring", "Wardrobes", "Commercial", "Refurbishments"];

// Preferred image filenames per category (user-renamed assets). These will be used when available.
// Files should be placed in artifacts/essex-carpenters/public/images

// Prefix helper that respects Vite's base path (so assets also work under subpaths)
function withBase(p: string) {
  const base = (import.meta as any).env?.BASE_URL ?? "/";
  const clean = p.startsWith("/") ? p.slice(1) : p;
  return `${base}${clean}`;
}

const categoryImageCandidates: Record<Exclude<Category, "All">, string[]> = {
  "FD30/60 Fire Door Installations": [withBase("images/firedoor1.jpg"), withBase("images/firedoor2.jpg"), withBase("images/firedoor1.png")],
  "Kitchens": [withBase("images/kitchen1.jpg"), withBase("images/kitchen2.jpg"), withBase("images/kitchen3.jpg"), withBase("images/kitchen4.jpg"), withBase("images/kitchen5.jpg"), withBase("images/kitchen6.jpg")],
  "Flooring": [withBase("images/flooring1.jpg"), withBase("images/flooring2.jpg"), withBase("images/flooring3.jpg"), withBase("images/flooring1.png")],
  "Wardrobes": [withBase("images/wardrobe1.jpg"), withBase("images/wardrobe2.jpg"), withBase("images/wardrobe3.jpg"), withBase("images/wardrobe4.jpg"), withBase("images/wardrobe5.jpg"), withBase("images/wardrobe6.jpg")],
  "Commercial": [withBase("images/commercial1.jpg"), withBase("images/commercial2.jpg"), withBase("images/commercial3.jpg"), withBase("images/commercial4.jpg"), withBase("images/commercial5.jpg"), withBase("images/commercial6.jpg")],
  "Refurbishments": [withBase("images/refurb1.jpg"), withBase("images/refurb2.jpg"), withBase("images/refurb3.jpg"), withBase("images/refurb4.jpg")],
};

function getCandidatesForCategory(category: Category): string[] {
  if (category === "All") return [];
  return categoryImageCandidates[category as Exclude<Category, "All">] || [];
}

function getFallbackCandidatesForImage(category: Category, primaryImage: string): string[] {
  return getCandidatesForCategory(category).filter((candidate) => candidate !== primaryImage);
}

function gridImageSizes(size: string) {
  if (size === "large") return "(min-width: 1024px) 50vw, (min-width: 768px) 66vw, 100vw";
  if (size === "medium") return "(min-width: 1024px) 50vw, (min-width: 768px) 66vw, 100vw";
  return "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw";
}

function responsiveWebpSet(src: string) {
  const base = src.replace(/\.[a-zA-Z0-9]+$/, "");
  return `${base}.w640.webp 640w, ${base}.w960.webp 960w, ${base}.w1280.webp 1280w`;
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

type GridImageProps = {
  src: string;
  alt: string;
  size: string;
  candidatesCsv: string;
  legacyFallback: string;
};

function GridImage({ src, alt, size, candidatesCsv, legacyFallback }: GridImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const node = imgRef.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <picture>
      <source
        type="image/webp"
        srcSet={isVisible ? responsiveWebpSet(src) : undefined}
        sizes={gridImageSizes(size)}
      />
      <img
        ref={imgRef}
        src={isVisible ? src : TRANSPARENT_PX}
        alt={alt}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        sizes={gridImageSizes(size)}
        data-candidates={candidatesCsv}
        data-legacy-fallback={legacyFallback}
        onError={handleErrorWithCandidates}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
    </picture>
  );
}

// Gallery items mapped to real images in public/images
// Note: Using Vite public folder paths like "/images/..." for optimal performance (no bundling of large assets).
const projects = [
  { id: 1, category: "Kitchens" as Category, title: "Modern Kitchen Fit-Out", location: "Romford", size: "large",
    image: withBase("images/kitchen1.jpg"), alt: "Modern kitchen installation - Design 1", bg: "from-amber-900 to-stone-800", overlay: "Kitchen Installation" },
  { id: 2, category: "Kitchens" as Category, title: "Contemporary Kitchen Design", location: "Southend", size: "small",
    image: withBase("images/kitchen2.jpg"), alt: "Contemporary kitchen design - Design 2", bg: "from-amber-900 to-stone-800", overlay: "Kitchen Installation" },
  { id: 3, category: "Kitchens" as Category, title: "Classic Kitchen Renovation", location: "Basildon", size: "small",
    image: withBase("images/kitchen3.jpg"), alt: "Classic kitchen renovation - Design 3", bg: "from-amber-900 to-stone-800", overlay: "Kitchen Installation" },
  { id: 4, category: "Kitchens" as Category, title: "Bespoke Kitchen Cabinetry", location: "Colchester", size: "small",
    image: withBase("images/kitchen4.jpg"), alt: "Bespoke kitchen cabinetry - Design 4", bg: "from-amber-900 to-stone-800", overlay: "Kitchen Installation" },
  { id: 5, category: "Kitchens" as Category, title: "Luxury Kitchen Installation", location: "Chelmsford", size: "medium",
    image: withBase("images/kitchen5.jpg"), alt: "Luxury kitchen installation - Design 5", bg: "from-amber-900 to-stone-800", overlay: "Kitchen Installation" },
  { id: 6, category: "Kitchens" as Category, title: "Premium Kitchen Suite", location: "Loughton", size: "small",
    image: withBase("images/kitchen6.jpg"), alt: "Premium kitchen suite - Design 6", bg: "from-amber-900 to-stone-800", overlay: "Kitchen Installation" },
  { id: 7, category: "FD30/60 Fire Door Installations" as Category, title: "FD60 Fire Door Installation", location: "Chelmsford", size: "small",
    image: withBase("images/firedoor1.jpg"), alt: "FD60 fire door installation - Project 1", bg: "from-red-900 to-stone-900", overlay: "Fire Door Installation" },
  { id: 8, category: "FD30/60 Fire Door Installations" as Category, title: "FD60 Fire Door Upgrade", location: "Romford", size: "small",
    image: withBase("images/firedoor2.jpg"), alt: "FD60 fire door upgrade - Project 2", bg: "from-red-900 to-stone-900", overlay: "Fire Door Installation" },
  { id: 9, category: "Wardrobes" as Category, title: "Built-In Sliding Wardrobes", location: "Hornchurch", size: "small",
    image: withBase("images/wardrobe1.jpg"), alt: "Built-in sliding wardrobes - Project 1", bg: "from-stone-700 to-stone-900", overlay: "Wardrobes" },
  { id: 10, category: "Wardrobes" as Category, title: "Walk-In Wardrobe Joinery", location: "Romford", size: "small",
    image: withBase("images/wardrobe2.jpg"), alt: "Walk-in wardrobe joinery - Project 2", bg: "from-stone-700 to-stone-900", overlay: "Wardrobes" },
  { id: 11, category: "Wardrobes" as Category, title: "Mirror Door Wardrobe Fit", location: "Barking", size: "small",
    image: withBase("images/wardrobe3.jpg"), alt: "Mirror door wardrobe fit - Project 3", bg: "from-stone-700 to-stone-900", overlay: "Wardrobes" },
  { id: 12, category: "Wardrobes" as Category, title: "Bespoke Alcove Wardrobe", location: "Upminster", size: "small",
    image: withBase("images/wardrobe4.jpg"), alt: "Bespoke alcove wardrobe - Project 4", bg: "from-stone-700 to-stone-900", overlay: "Wardrobes" },
  { id: 13, category: "Wardrobes" as Category, title: "Full Height Wardrobe Suite", location: "Dagenham", size: "medium",
    image: withBase("images/wardrobe5.jpg"), alt: "Full height wardrobe suite - Project 5", bg: "from-stone-700 to-stone-900", overlay: "Wardrobes" },
  { id: 21, category: "Wardrobes" as Category, title: "Modern Wardrobe Storage Wall", location: "Ilford", size: "small",
    image: withBase("images/wardrobe6.jpg"), alt: "Modern wardrobe storage wall - Project 6", bg: "from-stone-700 to-stone-900", overlay: "Wardrobes" },
  { id: 14, category: "Flooring" as Category, title: "Hardwood Oak Flooring", location: "Brentwood", size: "medium",
    image: withBase("images/flooring1.jpg"), alt: "Hardwood oak flooring - Project 1", bg: "from-yellow-900 to-amber-950", overlay: "Oak Flooring" },
  { id: 15, category: "Flooring" as Category, title: "Engineered Wood Flooring", location: "Ilford", size: "small",
    image: withBase("images/flooring2.jpg"), alt: "Engineered wood flooring - Project 2", bg: "from-yellow-900 to-amber-950", overlay: "Wood Flooring" },
  { id: 16, category: "Flooring" as Category, title: "Premium Laminate Finish", location: "Chigwell", size: "small",
    image: withBase("images/flooring3.jpg"), alt: "Premium laminate flooring - Project 3", bg: "from-yellow-900 to-amber-950", overlay: "Laminate Flooring" },
  { id: 17, category: "Commercial" as Category, title: "Office Fit-Out Carpentry", location: "East London", size: "large",
    image: withBase("images/commercial1.jpg"), alt: "Commercial carpentry fit-out - Project 1", bg: "from-zinc-800 to-stone-900", overlay: "Commercial" },
  { id: 18, category: "Commercial" as Category, title: "Retail Unit Joinery", location: "Stratford", size: "small",
    image: withBase("images/commercial2.jpg"), alt: "Retail unit joinery - Project 2", bg: "from-zinc-800 to-stone-900", overlay: "Commercial" },
  { id: 19, category: "Commercial" as Category, title: "Commercial Exterior Carpentry", location: "Canary Wharf", size: "small",
    image: withBase("images/commercial3.jpg"), alt: "Commercial Exterior carpentry - Project 3", bg: "from-zinc-800 to-stone-900", overlay: "Commercial" },
  { id: 22, category: "Commercial" as Category, title: "Business Unit Refit", location: "Ilford", size: "small",
    image: withBase("images/commercial4.jpg"), alt: "Business unit refit - Project 4", bg: "from-zinc-800 to-stone-900", overlay: "Commercial" },
  { id: 23, category: "Commercial" as Category, title: "Reception Area Carpentry", location: "Romford", size: "small",
    image: withBase("images/commercial5.jpg"), alt: "Reception area carpentry - Project 5", bg: "from-zinc-800 to-stone-900", overlay: "Commercial" },
  { id: 24, category: "Commercial" as Category, title: "Retail Joinery Installation", location: "Barking", size: "medium",
    image: withBase("images/commercial6.jpg"), alt: "Retail joinery installation - Project 6", bg: "from-zinc-800 to-stone-900", overlay: "Commercial" },
  { id: 20, category: "Refurbishments" as Category, title: "Full Property Renovation", location: "South Woodford", size: "small",
    image: withBase("images/refurb1.jpg"), alt: "Property refurbishment - Project 1", bg: "from-stone-600 to-stone-900", overlay: "Refurbishment" },
  { id: 25, category: "Refurbishments" as Category, title: "Extension Unit", location: "Billericay", size: "small",
    image: withBase("images/refurb2.jpg"), alt: "Kitchen and living refit - Project 2", bg: "from-stone-600 to-stone-900", overlay: "Refurbishment" },
  { id: 26, category: "Refurbishments" as Category, title: "Complete Interior Upgrade", location: "Loughton", size: "medium",
    image: withBase("images/refurb3.jpg"), alt: "Complete interior upgrade - Project 3", bg: "from-stone-600 to-stone-900", overlay: "Refurbishment" },
  { id: 27, category: "Refurbishments" as Category, title: "Residential Refurbishment Works", location: "Chadwell Heath", size: "small",
    image: withBase("images/refurb4.jpg"), alt: "Residential refurbishment works - Project 4", bg: "from-stone-600 to-stone-900", overlay: "Refurbishment" },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [lightboxItem, setLightboxItem] = useState<typeof projects[0] | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  // Guard against accidental duplicate entries in content data.
  const uniqueProjects = useMemo(() => projects.filter((project, index, all) =>
    all.findIndex((p) => p.id === project.id) === index
  ), []);

  const filtered = useMemo(() => activeCategory === "All"
    ? uniqueProjects
    : uniqueProjects.filter((p) => p.category === activeCategory), [activeCategory, uniqueProjects]);

  useEffect(() => {
    setVisibleCount(activeCategory === "All" ? 12 : 24);
  }, [activeCategory]);

  const visibleProjects = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );

  function preloadImage(src: string) {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
  }

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
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0.75 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-dense gap-3 md:gap-4"
        >
          {visibleProjects.map((project) => (
            <div
              key={project.id}
              className={`relative group cursor-pointer rounded-2xl overflow-hidden border border-border/40 hover:border-primary/50 transition-all duration-300 ${
                project.size === 'large' ? 'col-span-2 row-span-2' : project.size === 'medium' ? 'col-span-2' : ''
              }`}
              style={{
                minHeight: project.size === 'large' ? 360 : project.size === 'medium' ? 200 : 180,
                contentVisibility: "auto",
                containIntrinsicSize: project.size === "large" ? "360px" : project.size === "medium" ? "200px" : "180px",
              }}
              onMouseEnter={() => preloadImage(project.image)}
              onClick={() => setLightboxItem(project)}
            >
                  {/* Image */}
                  <GridImage
                    src={project.image}
                    alt={project.alt}
                    size={project.size}
                    candidatesCsv={getFallbackCandidatesForImage(project.category, project.image).join(",")}
                    legacyFallback={project.image}
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
            </div>
          ))}
        </motion.div>

        {activeCategory === "All" && visibleCount < filtered.length && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
            >
              Load More Projects
            </button>
          </div>
        )}

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
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={responsiveWebpSet(lightboxItem.image)}
                      sizes="(min-width: 1200px) 70vw, 95vw"
                    />
                    <img
                      src={lightboxItem.image}
                      alt={lightboxItem.alt}
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      data-candidates={getFallbackCandidatesForImage(lightboxItem.category, lightboxItem.image).join(",")}
                      data-legacy-fallback={lightboxItem.image}
                      onError={handleErrorWithCandidates}
                      sizes="(min-width: 1200px) 70vw, 95vw"
                      className="w-full h-auto max-h-[70vh] object-contain bg-black"
                    />
                  </picture>
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
