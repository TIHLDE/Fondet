"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/anim";

// Floating button that appears once the page is scrolled past the first
// viewport and jumps back to the top.
export default function BackToTop() {
  const [show, setShow] = useState(false);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
      }
      aria-label="Tilbake til toppen"
      className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-cardBorder bg-cardBackground text-foreground-primary shadow-lg transition-colors hover:bg-cardBorder/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground-primary"
    >
      <ArrowUp className="h-5 w-5" aria-hidden />
    </button>
  );
}
