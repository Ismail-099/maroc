import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, ArrowRight, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

async function getArtisan(slug: string) {
  const artisan = await prisma.artisan.findUnique({
    where: { slug },
    include: { products: true, stories: true },
  });
  if (!artisan) return null;
  return artisan;
}

export default async function ArtisanPage({ params }: { params: { slug: string } }) {
  const artisan = await getArtisan(params.slug);
  if (!artisan) return notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="relative h-[350px] overflow-hidden mb-8">
        {artisan.image ? (
          <Image src={artisan.image} alt={artisan.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-stone-300" />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="p-8 text-white">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{artisan.name}</h1>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {artisan.region}, Maroc</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-accent text-accent" /> {artisan.rating} ({artisan.reviewCount} avis)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12 mb-16">
        <div className="lg:col-span-2">
          <blockquote className="text-xl md:text-2xl font-serif italic text-stone-700 mb-6 border-l-4 border-primary pl-6">
            &ldquo;La terre et une main vivante, c&apos;est notre recette du bonheur.&rdquo;
          </blockquote>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Son histoire</h2>
          <p className="text-stone-600 leading-relaxed mb-8">{artisan.bio}</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {artisan.products.slice(0, 3).map((p, i) => {
              const img = p.images.split("|")[0];
              return (
                <Link key={i} href={`/produit/${p.slug}`} className="relative aspect-square overflow-hidden bg-stone-100">
                  <Image src={img} alt={p.name} fill className="object-cover hover:scale-105 transition-transform" />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-sand p-6">
            <h3 className="font-medium text-stone-900 mb-4">Ses chiffres</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-stone-900">{artisan.products.length}</p>
                <p className="text-xs text-stone-500">Creations</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-900">{artisan.reviewCount}</p>
                <p className="text-xs text-stone-500">Avis clients</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-900">{artisan.rating}</p>
                <p className="text-xs text-stone-500">Note moyenne</p>
              </div>
            </div>
          </div>

          <div className="bg-stone-900 text-white p-6">
            <h3 className="font-medium mb-3">Soutenez cet artisan</h3>
            <p className="text-sm text-stone-300 mb-4">
              En achetant ses creations, vous contribuez directement a la preservation de son savoir-faire.
            </p>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Contacter via WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Products */}
      {artisan.products.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-bold text-stone-900">Ses creations</h2>
            <Link href="/catalogue" className="text-sm text-primary hover:text-primary-dark flex items-center gap-1">
              Voir tous ses produits <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {artisan.products.map((p) => {
              const img = p.images.split("|")[0];
              return (
                <Link key={p.id} href={`/produit/${p.slug}`} className="group block">
                  <div className="relative aspect-square overflow-hidden bg-stone-100 mb-3">
                    <Image src={img} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-medium text-stone-900 text-sm group-hover:text-primary transition-colors">{p.name}</h3>
                  <p className="font-semibold text-stone-900 mt-1">{p.price} MAD</p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
