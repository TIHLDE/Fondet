"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

// Fires once when the element first scrolls into view. Uses a callback ref so
// the observer attaches the moment the node mounts, even if that happens after
// the first render (e.g. a component that renders a skeleton while loading and
// swaps in the real element later).
export function useInView<T extends Element>(
  threshold = 0.2,
): [(node: T | null) => void, boolean] {
  const [inView, setInView] = useState(false);
  const obs = useRef<IntersectionObserver | null>(null);
  const ref = useCallback(
    (node: T | null) => {
      obs.current?.disconnect();
      if (!node) return;
      obs.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            obs.current?.disconnect();
          }
        },
        { threshold },
      );
      obs.current.observe(node);
    },
    [threshold],
  );
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
