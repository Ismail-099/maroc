import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, ShieldCheck, Truck, CreditCard, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getHeroSlides, getSiteImage } from "@/lib/siteImages";
import Hero from "@/components/Hero";

async function getHomeData() {
  const [products, categories, heroSlides, storyImage, magazineImage] = await Promise.all([
    prisma.product.findMany({
      take: 6,
      include: { category: true, artisan: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ take: 6 }),
    getHeroSlides(),
    getSiteImage("section-story", "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800"),
    getSiteImage("section-magazine", "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800"),
  ]);
  return { products, categories, heroSlides, storyImage, magazineImage };
}

export default async function HomePage() {
  const { products, categories, heroSlides, storyImage, magazineImage } = await getHomeData();

  return (
    <>
      {/* Hero */}
      <Hero slides={heroSlides} />

      {/* Trust badges */}
      <section className="bg-sand border-b border-stone-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-stone-600">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span>Artisanat authentique</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Artisans locaux</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-primary" />
              <span>Livraison internationale</span>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <span>Paiement securise</span>
            </div>
          </div>
        </div>
      </section>

      {/* Notre selection */}
      <section className="py-16 bg-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">Notre selection</h2>
            <Link href="/catalogue" className="text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-1">
              Voir tout le catalogue <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-lg font-serif font-bold uppercase tracking-wider mb-4">
                    {cat.name}
                  </h3>
                  <span className="inline-block border border-white text-white text-xs uppercase tracking-widest px-5 py-2.5 hover:bg-white hover:text-stone-900 transition-colors">
                    Decouvrir
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Story section */}
      <section className="py-16 bg-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] overflow-hidden">
              <Image
                src={storyImage}
                alt="Artisan au travail"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-6">
                Plus qu&apos;un produit,<br />une histoire humaine
              </h2>
              <p className="text-stone-600 leading-relaxed mb-6">
                Chaque creation est le fruit d&apos;un savoir-faire transmis de generation en generation. 
                En achetant chez nos artisans, vous soutenez directement des familles et preservez 
                un heritage culturel millenaire.
              </p>
              <Link
                href="/artisans"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 font-medium hover:bg-primary-dark transition-colors"
              >
                Decouvrir les artisans <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-16 bg-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-8">Nos pieces favorites</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

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

function ProductCard({ product }: { product: any }) {
  const image = product.images.split("|")[0];
  return (
    <Link href={`/produit/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 mb-3">
        <Image src={image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="flex items-center gap-1 mb-1">
        <Star className="w-3 h-3 fill-accent text-accent" />
        <span className="text-xs text-stone-500">{product.rating} ({product.reviewCount})</span>
      </div>
      <h3 className="font-medium text-stone-900 text-sm mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
      <p className="text-xs text-stone-500 mb-1">{product.artisan.name}, {product.artisan.region}</p>
      <p className="font-semibold text-stone-900">{product.price} MAD</p>
    </Link>
  );
}
