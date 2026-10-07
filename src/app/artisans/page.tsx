import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getArtisans() {
  return prisma.artisan.findMany({
    include: { products: { take: 3, select: { images: true, slug: true, name: true } } },
    orderBy: { rating: "desc" },
  });
}

export default async function ArtisansPage() {
  const artisans = await getArtisans();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-3">Nos artisans</h1>
        <p className="text-stone-600 max-w-2xl mx-auto">
          Rencontrez les hommes et les femmes qui perpetuent les savoir-faire traditionnels du Maroc.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artisans.map((artisan) => (
          <div key={artisan.id} className="bg-sand-light border border-stone-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-stone-100">
              {artisan.image ? (
                <Image src={artisan.image} alt={artisan.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-stone-200" />
              )}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 text-xs font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {artisan.region}
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">{artisan.name}</h3>
              <p className="text-sm text-stone-500 mb-2">{artisan.specialty}</p>
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-3 h-3 fill-accent text-accent" />
                <span className="text-sm text-stone-600">{artisan.rating}</span>
                <span className="text-xs text-stone-400">({artisan.reviewCount} avis)</span>
              </div>
              <p className="text-sm text-stone-600 line-clamp-2 mb-4">{artisan.bio}</p>

              {artisan.products.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {artisan.products.map((p, i) => {
                    const img = p.images.split("|")[0];
                    return (
                      <Link key={i} href={`/produit/${p.slug}`} className="relative w-16 h-16 overflow-hidden bg-stone-100">
                        <Image src={img} alt={p.name} fill className="object-cover" />
                      </Link>
                    );
                  })}
                </div>
              )}

              <Link
                href={`/artisan/${artisan.slug}`}
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark font-medium"
              >
                Voir le profil <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
