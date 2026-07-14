"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const INTERVAL_MS = 6000;

export default function GroupCarousel({
  images,
  captions,
  aspect = "portrait",
  label = "Bilder av forvaltningsgruppen",
}: {
  images: string[];
  captions?: string[];
  aspect?: "portrait" | "landscape";
  label?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = mq.matches;
    const onChange = (e: MediaQueryListEvent) => {
      reducedMotion.current = e.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length],
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );

  useEffect(() => {
    if (paused || images.length < 2) return;
    const id = setInterval(() => {
      if (!reducedMotion.current) next();
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, next, images.length]);

  if (images.length === 0) return null;

  return (
    <section
      aria-roledescription="karusell"
      aria-label={label}
      data-testid="group-carousel"
      className={`relative mx-auto w-full overflow-hidden sm:rounded-lg sm:border border-y border-cardBorder bg-cardBackground shadow-lg ${
        aspect === "landscape" ? "max-w-3xl" : "max-w-lg"
      }`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className={`relative w-full ${
          aspect === "landscape" ? "aspect-[3/2]" : "aspect-[2/3]"
        }`}
      >
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={
              captions?.[i]
                ? `Gruppebilde fra ${captions[i]}, ${i + 1} av ${images.length}`
                : `Gruppebilde ${i + 1} av ${images.length}`
            }
            fill
            sizes={
              aspect === "landscape"
                ? "(min-width: 768px) 768px, 100vw"
                : "(min-width: 640px) 512px, 100vw"
            }
            priority={i === 0}
            aria-hidden={i !== index}
            className={`object-cover transition-opacity duration-700 motion-reduce:transition-none ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {captions?.[index] && (
        <p
          aria-hidden
          className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-sm font-medium text-white"
        >
          {captions[index]}
        </p>
      )}

      <p className="sr-only" aria-live="polite">
        {captions?.[index]
          ? `Bilde ${index + 1} av ${images.length}, fra ${captions[index]}`
          : `Bilde ${index + 1} av ${images.length}`}
      </p>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Forrige bilde"
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white transition-colors hover:bg-black/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Neste bilde"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white transition-colors hover:bg-black/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ChevronRight className="h-6 w-6" aria-hidden />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center rounded-full bg-black/45 px-1">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Vis bilde ${i + 1} av ${images.length}`}
                aria-current={i === index}
                className="flex h-11 w-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-white rounded-full"
              >
                <span
                  aria-hidden
                  className={`block h-2.5 w-2.5 rounded-full transition-colors ${
                    i === index ? "bg-white" : "bg-white/50"
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
