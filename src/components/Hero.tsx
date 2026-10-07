"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type HeroSlide = {
  src: string;
  alt: string;
};

const defaultSlides: HeroSlide[] = [
  {
    src: "https://images.unsplash.com/photo-1745837893977-34f76b11f644?w=1600",
    alt: "Tanneurs au travail dans une tannerie marocaine",
  },
  {
    src: "https://images.unsplash.com/photo-1767390552768-6703f91c2518?w=1600",
    alt: "Tissage d'un tapis au metier traditionnel",
  },
  {
    src: "https://images.unsplash.com/photo-1771148885308-7cbae216fb10?w=1600",
    alt: "Poteries et artisanat traditionnel au souk",
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1663040237172-c8974380a5d6?w=1600",
    alt: "Artisan faconnant l'argile au tour de potier",
  },
];

export default function Hero({ slides = defaultSlides }: { slides?: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-[600px] flex items-center">
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            className={`object-cover transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            priority={i === 0}
          />
        ))}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full">
        <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6">
          L&apos;authenticite<br />du savoir-faire<br />marocain
        </h1>
        <p className="text-lg md:text-xl text-stone-200 mb-8 max-w-xl">
          Des artisans passionnes, des creations uniques, des histoires a chaque piece.
        </p>
        <div className="flex gap-4">
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 bg-white text-stone-900 px-6 py-3 font-medium hover:bg-stone-100 transition-colors"
          >
            Decouvrir le catalogue
          </Link>
          <Link
            href="/magazine"
            className="inline-flex items-center gap-2 border border-white text-white px-6 py-3 font-medium hover:bg-white/10 transition-colors"
          >
            Voir le magazine <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {slides.length > 0 && (
          <div className="absolute bottom-8 left-4 sm:left-6 lg:left-8 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Image ${i + 1}`}
                className={`w-8 h-1 transition-colors ${
                  i === index ? "bg-white" : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
