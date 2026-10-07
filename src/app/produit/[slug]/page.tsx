import Link from "next/link";
import Image from "next/image";
import { Star, Heart, MapPin, Clock, Ruler, Hammer, ArrowRight, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, artisan: true },
  });
  if (!product) return null;
  const similar = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    take: 4,
    include: { artisan: true },
  });
  return { product, similar };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const data = await getProduct(params.slug);
  if (!data) return notFound();
  const { product, similar } = data;
  const images = product.images.split("|");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-stone-500 mb-6">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <Link href="/catalogue" className="hover:text-primary">Catalogue</Link>
        <span className="mx-2">/</span>
        <Link href={`/catalogue?category=${product.category.slug}`} className="hover:text-primary">{product.category.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-900">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-[3fr_2fr] gap-12 mb-16">
        {/* Images */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            {images.slice(0, 4).map((img: string, i: number) => (
              <div key={i} className="relative w-16 h-16 overflow-hidden border border-stone-200 cursor-pointer hover:border-primary">
                <Image src={img.trim()} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
          <div className="relative flex-1 aspect-[3/4] overflow-hidden bg-stone-100">
            <Image src={images[0].trim()} alt={product.name} fill className="object-cover" />
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-accent text-accent" : "text-stone-300"}`} />
              ))}
            </div>
            <span className="text-sm text-stone-500">({product.reviewCount} avis)</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-stone-600 mb-6">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {product.artisan.region}</span>
            <span className="flex items-center gap-1"><Hammer className="w-4 h-4" /> {product.artisan.name}</span>
            {product.inStock ? (
              <span className="text-green-600 font-medium">En stock</span>
            ) : (
              <span className="text-red-500 font-medium">Rupture de stock</span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl font-bold text-stone-900">{product.price} MAD</span>
            {product.oldPrice && (
              <span className="text-lg text-stone-400 line-through">{product.oldPrice} MAD</span>
            )}
          </div>

          <div className="flex gap-3 mb-8">
            <button className="flex-1 bg-stone-900 text-white py-3 font-medium hover:bg-stone-800 transition-colors">
              Ajouter au panier
            </button>
            <button className="px-4 py-3 border border-stone-300 hover:bg-sand transition-colors">
              <Heart className="w-5 h-5 text-stone-600" />
            </button>
          </div>

          <a
            href={`https://wa.me/?text=Bonjour, je suis interesse par ${encodeURIComponent(product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full border border-green-600 text-green-700 py-3 font-medium hover:bg-green-50 transition-colors mb-8"
          >
            <MessageCircle className="w-5 h-5" /> Contacter l&apos;artisan
          </a>

          <div className="space-y-3 text-sm text-stone-600">
            {product.material && (
              <div className="flex items-center gap-2">
                <Hammer className="w-4 h-4 text-stone-400" />
                <span><strong>Materiau :</strong> {product.material}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-stone-400" />
                <span><strong>Dimensions :</strong> {product.dimensions}</span>
              </div>
            )}
            {product.technique && (
              <div className="flex items-center gap-2">
                <Hammer className="w-4 h-4 text-stone-400" />
                <span><strong>Technique :</strong> {product.technique}</span>
              </div>
            )}
            {product.deliveryTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-stone-400" />
                <span><strong>Delai :</strong> {product.deliveryTime}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="grid lg:grid-cols-3 gap-12 mb-16">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-serif font-bold text-stone-900 mb-4">Description</h2>
          <p className="text-stone-600 leading-relaxed mb-6">{product.description}</p>

          <h3 className="font-medium text-stone-900 mb-3">Caracteristiques</h3>
          <ul className="space-y-2 text-sm text-stone-600">
            {product.material && <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary" /> Materiau : {product.material}</li>}
            {product.dimensions && <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary" /> Dimensions : {product.dimensions}</li>}
            {product.technique && <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary" /> Technique : {product.technique}</li>}
            {product.deliveryTime && <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary" /> Delai de livraison : {product.deliveryTime}</li>}
          </ul>
        </div>

        <div className="bg-sand p-6">
          <h3 className="font-medium text-stone-900 mb-3">Vous avez une question ?</h3>
          <p className="text-sm text-stone-600 mb-4">Contactez directement l&apos;artisan via WhatsApp.</p>
          <a
            href={`https://wa.me/?text=Bonjour, j'ai une question sur ${encodeURIComponent(product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        </div>
      </div>

      {/* Artisan mini */}
      <div className="bg-sand p-6 mb-16">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 overflow-hidden bg-stone-200">
            {product.artisan.image && <Image src={product.artisan.image} alt={product.artisan.name} fill className="object-cover" />}
          </div>
          <div>
            <p className="font-medium text-stone-900">{product.artisan.name}</p>
            <p className="text-sm text-stone-500">{product.artisan.specialty} &middot; {product.artisan.region}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 fill-accent text-accent" />
              <span className="text-xs text-stone-500">{product.artisan.rating} ({product.artisan.reviewCount} avis)</span>
            </div>
          </div>
          <Link href={`/artisan/${product.artisan.slug}`} className="ml-auto text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1">
            Voir le profil <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Similar products */}
      {similar.length > 0 && (
        <div>
          <h2 className="text-xl font-serif font-bold text-stone-900 mb-6">Produits similaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {similar.map((p: any) => {
              const img = p.images.split("|")[0];
              return (
                <Link key={p.id} href={`/produit/${p.slug}`} className="group block">
                  <div className="relative aspect-square overflow-hidden bg-stone-100 mb-3">
                    <Image src={img} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-medium text-stone-900 text-sm group-hover:text-primary transition-colors">{p.name}</h3>
                  <p className="text-xs text-stone-500">{p.artisan.name}</p>
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
