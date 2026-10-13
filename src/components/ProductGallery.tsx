"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const activeImage = images[selectedIndex]?.trim() || images[0]?.trim();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {images.map((img, i) => {
            const isSelected = i === selectedIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/20 scale-[1.03]"
                    : "border-stone-200 opacity-70 hover:opacity-100 hover:border-stone-400"
                }`}
              >
                <Image
                  src={img.trim()}
                  alt={`${productName} miniature ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Image with Zoom Effect */}
      <div
        className="relative flex-1 aspect-[3/4] overflow-hidden bg-stone-100 border border-stone-200 group cursor-crosshair select-none"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={activeImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className={`object-cover transition-transform duration-200 ease-out ${
            isZoomed ? "scale-150" : "scale-100 group-hover:scale-105"
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }
              : undefined
          }
        />

        {/* Subtle Indicator */}
        <div className="absolute bottom-3 right-3 bg-stone-900/60 backdrop-blur-sm text-white px-2.5 py-1 text-xs rounded-full flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none">
          <ZoomIn className="w-3.5 h-3.5" />
          <span>Survoler pour zoomer</span>
        </div>
      </div>
    </div>
  );
}
