import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Truck, CreditCard, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getHeroSlides, getSiteImage } from "@/lib/siteImages";
import Hero from "@/components/Hero";
import CustomerReviews from "@/components/CustomerReviews";
import HomeInspirations from "@/components/HomeInspirations";
import ArtisanMaterials from "@/components/ArtisanMaterials";

async function getHomeData() {
  const [categories, heroSlides, storyImage, magazineImage] = await Promise.all([
    prisma.category.findMany({ take: 6 }),
    getHeroSlides(),
    getSiteImage("section-story", "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800"),
    getSiteImage("section-magazine", "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800"),
  ]);
  return { categories, heroSlides, storyImage, magazineImage };
}

export default async function HomePage() {
  const { categories, heroSlides, storyImage, magazineImage } = await getHomeData();

  return (
    <>
      {/* Hero */}
      <Hero slides={heroSlides} />

      {/* Trust badges */}
      <section className="bg-white border-b border-stone-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs uppercase tracking-widest text-stone-700">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-stone-900" />
              <span>Artisanat authentique</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-stone-900" />
              <span>Artisans locaux</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-stone-900" />
              <span>Livraison internationale</span>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-stone-900" />
              <span>Paiement sécurisé</span>
            </div>
          </div>
        </div>
      </section>

      {/* Notre selection */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold block mb-1">Collections</span>
              <h2 className="text-3xl md:text-4xl font-serif font-medium text-stone-900">Notre sélection</h2>
            </div>
            <Link href="/catalogue" className="text-xs uppercase tracking-widest font-semibold text-stone-900 hover:opacity-70 flex items-center gap-1.5 transition-opacity">
              Tout le catalogue <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalogue?category=${cat.slug}`}
                className="group relative aspect-[3/4] overflow-hidden bg-stone-100 block"
              >
                {cat.images ? (
                  <Image
                    src={cat.images.split("|")[0].trim().replace("?w=400", "?w=800")}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-200" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-white text-xl font-serif font-medium uppercase tracking-wider mb-4">
                    {cat.name}
                  </h3>
                  <span className="inline-block border border-white text-white text-[11px] uppercase tracking-widest px-6 py-2.5 hover:bg-white hover:text-stone-900 transition-colors">
                    Découvrir
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Story section */}
      <section className="py-20 bg-stone-50 border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative h-[460px] overflow-hidden">
              <Image
                src={storyImage}
                alt="Artisan au travail"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold block mb-2">Héritage & Savoir-faire</span>
              <h2 className="text-3xl md:text-5xl font-serif font-medium text-stone-900 mb-6 leading-tight">
                Plus qu&apos;un produit,<br />une histoire humaine
              </h2>
              <p className="text-stone-600 leading-relaxed mb-8 text-sm md:text-base font-light">
                Chaque création est le fruit d&apos;un savoir-faire transmis de génération en génération. 
                En achetant chez nos artisans, vous soutenez directement des familles et préservez 
                un héritage culturel millénaire.
              </p>
              <Link
                href="/artisans"
                className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-stone-800 transition-colors"
              >
                Découvrir les artisans <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Matières Nobles & Savoir-Faire (Option 2) */}
      <ArtisanMaterials />

      {/* Galerie Inspirations Déco / Instagram Shop (Option 3) */}
      <HomeInspirations />

      {/* Preuve sociale & Avis clients 5 étoiles (Option 2) */}
      <CustomerReviews />

      {/* Magazine preview */}
      <section className="py-16 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                Le Maroc, terre d&apos;art et de tradition
              </h2>
              <p className="text-stone-300 leading-relaxed mb-6">
                Explorez notre magazine et plongez dans l&apos;univers de l&apos;artisanat marocain. 
                Histoires, traditions et inspirations a decouvrir.
              </p>
              <Link
                href="/magazine"
                className="inline-flex items-center gap-2 border border-white text-white px-6 py-3 font-medium hover:bg-white/10 transition-colors"
              >
                Lire le magazine <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative h-[300px] overflow-hidden">
              <Image
                src={magazineImage}
                alt="Maroc"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
