"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

// True when the user asked the OS to reduce motion. SSR-safe: starts false and
// syncs after mount, so the server and first client render agree.
export function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduce;
}

// Fires once when the element first scrolls into view.
export function useInView<T extends Element>(
  threshold = 0.2,
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// Eases a number from 0 to target once `start` is true. Snaps straight to the
// target when the user prefers reduced motion.
export function useCountUp(target: number, start: boolean, duration = 1100): number {
  const reduce = usePrefersReducedMotion();
  const [value, setValue] = useState(0);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!start) return;
    if (reduce) {
      setValue(target);
      return;
    }
    let t0: number | null = null;
    const tick = (t: number) => {
      if (t0 === null) t0 = t;
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [target, start, duration, reduce]);

  return value;
}
