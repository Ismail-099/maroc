import { prisma } from "@/lib/prisma";
import { getSiteImage } from "@/lib/siteImages";
import CatalogueClient, { CategoryItem, ProductItem } from "@/components/CatalogueClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Catalogue - Artisanat Maroc",
  description: "Découvrez notre catalogue de pièces artisanales marocaines d'exception faites main.",
};

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  // Fetch all categories and all products with artisans
  const [categoriesRaw, productsRaw, banner] = await Promise.all([
    prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      include: {
        category: true,
        artisan: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    getSiteImage(
      "banner-catalogue",
      "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1600"
    ),
  ]);

  // Extract unique regions
  const regionsSet = new Set<string>();
  productsRaw.forEach((p) => {
    if (p.artisan?.region) {
      regionsSet.add(p.artisan.region);
    }
  });
  const allRegions = Array.from(regionsSet).sort();

  // Map categories to client format
  const categories: CategoryItem[] = categoriesRaw.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    images: c.images,
    productCount: c._count.products,
  }));

  // Map products to client format
  const products: ProductItem[] = productsRaw.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    oldPrice: p.oldPrice,
    images: p.images,
    inStock: p.inStock,
    rating: p.rating,
    reviewCount: p.reviewCount,
    material: p.material,
    dimensions: p.dimensions,
    technique: p.technique,
    categoryId: p.categoryId,
    category: {
      id: p.category.id,
      name: p.category.name,
      slug: p.category.slug,
    },
    artisan: {
      id: p.artisan.id,
      name: p.artisan.name,
      region: p.artisan.region,
      specialty: p.artisan.specialty,
    },
  }));

  return (
    <CatalogueClient
      categories={categories}
      initialProducts={products}
      allRegions={allRegions}
      bannerUrl={banner}
    />
  );
}
