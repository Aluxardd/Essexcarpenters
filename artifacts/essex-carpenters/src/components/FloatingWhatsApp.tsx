import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const whatsappUrl = "https://wa.me/447459414385?text=Hi%20Essex%20Carpenters%2C%20I%27d%20like%20to%20request%20a%20free%20quote.";

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3">
      {/* Tooltip / chat bubble */}
      <AnimatePresence>
        {showTooltip && !dismissed && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="relative bg-card border border-border rounded-2xl px-4 py-3 shadow-xl max-w-[220px] text-sm"
          >
            <button
              onClick={() => setDismissed(true)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-muted rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
            >
              <X size={10} />
            </button>
            <p className="font-semibold font-heading text-sm mb-0.5">Chat with us</p>
            <p className="text-xs text-muted-foreground">Request a free quote on WhatsApp</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 300, damping: 20 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110 active:scale-95"
        style={{ backgroundColor: "#25D366" }}
        aria-label="Chat on WhatsApp"
      >
        {/* WhatsApp SVG icon */}
        <svg width="28" height="28" viewBox="0 0 32 32" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.004 2.667C8.638 2.667 2.667 8.637 2.667 16c0 2.355.637 4.637 1.846 6.634L2.667 29.333l6.895-1.811A13.291 13.291 0 0016.004 29.333C23.37 29.333 29.333 23.363 29.333 16S23.37 2.667 16.004 2.667zm0 24.293a11.013 11.013 0 01-5.602-1.533l-.401-.239-4.095 1.073 1.094-3.984-.263-.41A10.958 10.958 0 015.005 16c0-6.065 4.934-11 11-11s11 4.935 11 11-4.935 11-11 11zm6.064-8.234c-.332-.166-1.964-.967-2.268-1.077-.304-.11-.525-.166-.747.166-.22.332-.856 1.077-1.048 1.297-.193.22-.386.247-.718.083-.332-.166-1.403-.517-2.67-1.647-.988-.88-1.656-1.966-1.85-2.298-.193-.332-.02-.511.146-.677.149-.148.332-.386.498-.58.166-.193.22-.332.332-.553.11-.22.055-.414-.028-.58-.083-.166-.747-1.8-1.024-2.467-.27-.647-.544-.559-.747-.568l-.636-.01c-.22 0-.58.082-.883.414-.304.332-1.161 1.134-1.161 2.765s1.189 3.207 1.355 3.43c.166.22 2.343 3.576 5.675 5.015.793.343 1.412.547 1.894.7.795.253 1.52.217 2.093.132.638-.095 1.964-.803 2.24-1.578.276-.775.276-1.44.193-1.578-.082-.138-.304-.22-.636-.386z"/>
        </svg>

        {/* Pulse ring */}
        <span className="absolute w-14 h-14 rounded-full animate-ping opacity-30" style={{ backgroundColor: "#25D366" }} />
      </motion.a>
    </div>
  );
}
