import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Instagram } from "lucide-react";

interface InspirationItem {
  id: string;
  image: string;
  alt: string;
  author: string;
  productName: string;
  categorySlug: string;
  categoryLabel: string;
  city: string;
}

const inspirations: InspirationItem[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
    alt: "Salon épuré avec tapis berbère traditionnel",
    author: "@atelier_clarisse",
    productName: "Tapis Beni Ouarain",
    categorySlug: "textiles-tapis",
    categoryLabel: "Textiles & Tapis",
    city: "Paris",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800",
    alt: "Espace salon lumineux avec céramique artisanale",
    author: "@nordic_maroc",
    productName: "Poterie & Vases de Safi",
    categorySlug: "poterie-ceramique",
    categoryLabel: "Poterie & Céramique",
    city: "Genève",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
    alt: "Coin lecture chaleureux avec table en bois sculpté",
    author: "@riad_modern_living",
    productName: "Table en bois de cèdre",
    categorySlug: "bois-sculpture",
    categoryLabel: "Bois & Sculpture",
    city: "Marrakech",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
    alt: "Table d'appoint avec objets décoratifs marocains",
    author: "@interior_harmonie",
    productName: "Objets & Céramique",
    categorySlug: "decoration",
    categoryLabel: "Décoration",
    city: "Bordeaux",
  },
];

export default function HomeInspirations() {
  return (
    <section className="py-14 sm:py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] md:text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold mb-2">
              <Instagram className="w-3.5 h-3.5 text-stone-900 shrink-0" />
              <span>#ArtisanatMarocChezVous</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-stone-900 leading-tight">
              L&apos;artisanat marocain dans vos intérieurs
            </h2>
          </div>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md font-light leading-relaxed">
            Plongez dans des atmosphères inspirantes où savoir-faire traditionnel et design contemporain se rencontrent.
          </p>
        </div>

        {/* Mosaic Grid - 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {inspirations.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-stone-100 block"
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

              {/* Instagram credit tag at top right */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/50 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[11px] text-white/90 font-light flex items-center gap-1 border border-white/10">
                <Instagram className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-stone-200" />
                <span className="truncate max-w-[80px] sm:max-w-none">{item.author}</span>
              </div>

              {/* Bottom content: Product highlight & direct link */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-300 font-medium block mb-0.5 sm:mb-1 truncate">
                  {item.categoryLabel} &bull; {item.city}
                </span>
                <h3 className="text-white text-xs sm:text-base font-serif font-medium mb-1.5 sm:mb-3 leading-snug line-clamp-1 sm:line-clamp-none">
                  {item.productName}
                </h3>
                <Link
                  href={`/catalogue?category=${item.categorySlug}`}
                  className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-white uppercase tracking-wider font-semibold border-b border-white/60 pb-0.5 hover:border-white transition-colors group/link"
                >
                  <span className="hidden sm:inline">Découvrir la collection</span>
                  <span className="sm:hidden">Découvrir</span>
                  <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram community banner */}
        <div className="mt-8 sm:mt-12 p-5 sm:p-6 bg-stone-50 border border-stone-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0">
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                Rejoignez notre communauté sur Instagram
              </p>
              <p className="text-xs text-stone-500 font-light">
                Partagez votre pièce avec <span className="font-medium text-stone-800">#ArtisanatMarocChezVous</span>.
              </p>
            </div>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center text-xs uppercase tracking-widest font-semibold bg-stone-900 text-white px-5 py-3 sm:py-2.5 hover:bg-stone-800 transition-colors shrink-0"
          >
            Suivre @artisanat.maroc
          </a>
        </div>
      </div>
    </section>
  );
}
