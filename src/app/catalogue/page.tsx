import Link from "next/link";
import Image from "next/image";
import { Heart, Star, SlidersHorizontal } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSiteImage } from "@/lib/siteImages";

async function getCatalogData(categorySlug?: string) {
  const categories = await prisma.category.findMany();
  const where = categorySlug ? { category: { slug: categorySlug } } : {};
  const products = await prisma.product.findMany({
    where,
    include: { category: true, artisan: true },
    orderBy: { createdAt: "desc" },
  });
  return { categories, products };
}

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const { categories, products } = await getCatalogData(searchParams.category);
  const banner = await getSiteImage("banner-catalogue", "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="relative h-[250px] overflow-hidden mb-8">
        <Image
          src={banner}
          alt="Notre catalogue"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">Notre catalogue</h1>
          <p className="text-stone-200 text-sm md:text-base max-w-xl">
            Des pieces uniques, faconnees avec passion par des artisans marocains.
          </p>
          <div className="mt-4 max-w-md">
            <input
              type="text"
              placeholder="Rechercher un produit, une categorie..."
              className="w-full px-4 py-2.5 bg-white/90 backdrop-blur text-stone-900 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Link
          href="/catalogue"
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            !searchParams.category ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"
          }`}
        >
          Toutes
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/catalogue?category=${cat.slug}`}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              searchParams.category === cat.slug ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            }`}
          >
            {cat.name}
          </Link>
        ))}
        <button className="ml-auto flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900">
          <SlidersHorizontal className="w-4 h-4" /> Trier par
        </button>
      </div>

      {/* Layout: sidebar + grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar categories */}
        <aside className="w-full lg:w-64 shrink-0">
          <h3 className="font-medium text-stone-900 mb-4">Categories</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/catalogue" className="flex items-center justify-between text-stone-600 hover:text-primary">
                <span>Toutes les categories</span>
                <span className="text-stone-400">({products.length})</span>
              </Link>
            </li>
            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id).length;
              return (
                <li key={cat.id}>
                  <Link href={`/catalogue?category=${cat.slug}`} className="flex items-center justify-between text-stone-600 hover:text-primary">
                    <span>{cat.name}</span>
                    <span className="text-stone-400">({count})</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {products.length === 0 && (
            <div className="text-center py-16 text-stone-500">Aucun produit trouve dans cette categorie.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const image = product.images.split("|")[0];
  return (
    <div className="group relative bg-sand-light border border-stone-200 overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/produit/${product.slug}`} className="block">
        <div className="relative aspect-square bg-stone-100">
          <Image src={image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      </Link>
      <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur hover:bg-white transition-colors">
        <Heart className="w-4 h-4 text-stone-600" />
      </button>
      <div className="p-4">
        <p className="text-xs text-stone-500 mb-1">{product.category.name} &middot; {product.artisan.name}</p>
        <Link href={`/produit/${product.slug}`} className="font-medium text-stone-900 text-sm hover:text-primary transition-colors line-clamp-1">
          {product.name}
        </Link>
        <div className="flex items-center gap-1 mt-2">
          <Star className="w-3 h-3 fill-accent text-accent" />
          <span className="text-xs text-stone-500">{product.rating} ({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="font-semibold text-stone-900">{product.price} MAD</span>
          {product.oldPrice && (
            <span className="text-xs text-stone-400 line-through">{product.oldPrice} MAD</span>
          )}
        </div>
      </div>
    </div>
  );
}
