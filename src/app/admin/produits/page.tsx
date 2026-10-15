import Link from "next/link";
import { ArrowLeft, Check, ExternalLink, ShoppingBag, Plus, Trash2, Hammer } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getUploads } from "@/lib/adminUploads";
import { createProduct, deleteProduct, updateProductInfo, updateListImage, deleteListImage, addListImage } from "../actions";
import ImageCard from "@/components/admin/ImageCard";
import ImageSourcePicker from "@/components/admin/ImageSourcePicker";
import SaveButton from "@/components/admin/SaveButton";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin • Produits" };

export default async function AdminProduitsPage({
  searchParams,
}: {
  searchParams: { saved?: string; category?: string };
}) {
  const [products, categories, artisans, uploads] = await Promise.all([
    prisma.product.findMany({
      include: { category: true, artisan: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.artisan.findMany({ orderBy: { name: "asc" } }),
    getUploads(),
  ]);

  const filtered = searchParams.category
    ? products.filter((p) => p.category.slug === searchParams.category)
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
        <Link href="/admin" className="hover:text-stone-900 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Tableau de bord
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-semibold">Produits du Catalogue</span>
      </nav>

      {/* Header */}
      <div className="mb-8 border-b border-stone-200/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A84C2C] font-semibold flex items-center gap-1">
              <ShoppingBag className="w-3 h-3" /> Catalogue Boutique
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">{products.length} articles</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Gestion des Produits
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-light">
            Ajoutez de nouveaux articles avec leurs photos, modifiez les prix et les descriptions.
          </p>
        </div>

        <Link
          href="/catalogue"
          target="_blank"
          className="btn-outline flex items-center gap-2 text-xs py-2 px-3 self-start sm:self-auto hover:border-stone-900"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#A84C2C]" />
          <span>Voir le catalogue en direct</span>
        </Link>
      </div>

      {/* Success Notification */}
      {searchParams.saved === "1" && (
        <div className="mb-8 border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs sm:text-sm px-4 py-3 flex items-center gap-2 shadow-sm animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Opération enregistrée avec succès.</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. ADD NEW PRODUCT FORM (Prominent & Simple) */}
      {/* ========================================================================= */}
      <div className="mb-12 border-2 border-stone-900 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-sm">
            +
          </div>
          <h2 className="text-lg font-serif font-bold text-stone-900">
            Ajouter un Nouveau Produit au Catalogue
          </h2>
        </div>
        <p className="text-xs text-stone-500 mb-6 font-light">
          Remplissez ce formulaire simple pour publier immédiatement un article dans votre boutique.
        </p>

        <form action={createProduct} className="space-y-4">
          <input type="hidden" name="returnTo" value="/admin/produits" />

          {/* Line 1: Name and Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-stone-800 block mb-1">
                Nom du produit *
              </label>
              <input
                name="name"
                required
                placeholder="Ex: Tapis Berbère Beni Ouarain Fait Main"
                className="input w-full"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-800 block mb-1">
                Prix en Dirhams (MAD) *
              </label>
              <input
                type="number"
                name="price"
                required
                min="1"
                placeholder="Ex: 1200"
                className="input w-full font-mono"
              />
            </div>
          </div>

          {/* Line 2: Category and Artisan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-800 block mb-1">
                Catégorie / Collection *
              </label>
              <select name="categoryId" required className="input w-full bg-white">
                <option value="">Sélectionnez une catégorie...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-800 block mb-1">
                Artisan Créateur
              </label>
              <select name="artisanId" className="input w-full bg-white">
                {artisans.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.region} - {a.specialty})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Line 3: Photo (Super simple) */}
          <div>
            <label className="text-xs font-semibold text-stone-800 block mb-1">
              Photo du produit (Depuis votre ordinateur ou lien web) *
            </label>
            <ImageSourcePicker uploads={uploads} />
          </div>

          {/* Line 4: Description */}
          <div>
            <label className="text-xs font-semibold text-stone-800 block mb-1">
              Description de la création
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Décrivez l'histoire de la pièce, son authenticité, ses matières et son usage..."
              className="input w-full"
            />
          </div>

          {/* Line 5: Optional Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1">
                Matière
              </label>
              <input name="material" placeholder="Ex: Laine vierge" className="input w-full text-xs" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1">
                Dimensions
              </label>
              <input name="dimensions" placeholder="Ex: 200 x 300 cm" className="input w-full text-xs" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1">
                Technique
              </label>
              <input name="technique" placeholder="Ex: Tissage manuel" className="input w-full text-xs" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1">
                Délai de livraison
              </label>
              <input name="deliveryTime" defaultValue="3 à 7 jours" className="input w-full text-xs" />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end">
            <SaveButton label="Enregistrer et publier le produit" variant="dark" className="py-2.5 px-6" />
          </div>
        </form>
      </div>

      {/* ========================================================================= */}
      {/* 2. EXISTING PRODUCTS LIST */}
      {/* ========================================================================= */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <h2 className="text-base font-serif font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <span>Tous les Produits</span>
            <span className="text-xs text-stone-400 font-sans font-normal">({filtered.length} affichés)</span>
          </h2>

          {/* Filter by Category */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <Link
              href="/admin/produits"
              className={`px-3 py-1 text-xs rounded-full transition-colors whitespace-nowrap ${
                !searchParams.category
                  ? "bg-stone-900 text-white font-semibold"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              Tous ({products.length})
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/admin/produits?category=${c.slug}`}
                className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                  searchParams.category === c.slug
                    ? "bg-stone-900 text-white font-semibold"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Products list */}
        <div className="space-y-6">
          {filtered.map((p) => {
            const list = p.images
              .split("|")
              .map((s: string) => s.trim())
              .filter(Boolean);

            return (
              <div key={p.id} className="border border-stone-200 bg-white p-5 shadow-sm">
                {/* Header card with delete button */}
                <div className="flex items-start justify-between gap-4 mb-4 border-b border-stone-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wider font-semibold text-[#A84C2C] bg-stone-100 px-2 py-0.5 rounded">
                        {p.category.name}
                      </span>
                      <span className="text-xs font-mono font-bold text-stone-900 bg-emerald-50 text-emerald-800 px-2 py-0.5 border border-emerald-200">
                        {p.price} MAD
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-stone-900 text-lg mt-1">{p.name}</h3>
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <Hammer className="w-3 h-3 text-stone-400" /> Artisan : {p.artisan.name} ({p.artisan.region})
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/produit/${p.slug}`}
                      target="_blank"
                      className="btn-outline flex items-center gap-1 text-xs py-1.5 px-2.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Fiche</span>
                    </Link>

                    <DeleteButton
                      action={deleteProduct}
                      id={p.id}
                      confirmMessage={`Êtes-vous sûr de vouloir supprimer définitivement "${p.name}" ?`}
                      label="Supprimer"
                    />
                  </div>
                </div>

                {/* Edit description */}
                <form action={updateProductInfo} className="flex gap-2 items-start mb-4">
                  <input type="hidden" name="id" value={p.id} />
                  <input
                    type="hidden"
                    name="returnTo"
                    value={searchParams.category ? `/admin/produits?category=${searchParams.category}` : "/admin/produits"}
                  />
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] uppercase tracking-wider text-stone-500 mb-1 block">
                      Modifier la description du produit
                    </label>
                    <textarea
                      name="description"
                      rows={2}
                      defaultValue={p.description ?? ""}
                      className="input w-full"
                    />
                  </div>
                  <SaveButton className="self-start mt-5" label="Sauvegarder" />
                </form>

                {/* Photos Gallery */}
                <div>
                  <p className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    Photos du produit ({list.length})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {list.map((src, idx) => (
                      <ImageCard
                        key={`${p.id}-${idx}`}
                        src={src}
                        alt={p.name}
                        title={`Photo ${idx + 1}`}
                        badges={[
                          { label: idx === 0 ? "Principale" : `Vue ${idx + 1}`, variant: idx === 0 ? "primary" : "muted" },
                        ]}
                        editAction={updateListImage}
                        editHiddenInputs={
                          <>
                            <input type="hidden" name="model" value="product" />
                            <input type="hidden" name="id" value={p.id} />
                            <input type="hidden" name="index" value={idx} />
                            <input
                              type="hidden"
                              name="returnTo"
                              value={searchParams.category ? `/admin/produits?category=${searchParams.category}` : "/admin/produits"}
                            />
                          </>
                        }
                        deleteAction={list.length > 1 ? deleteListImage : undefined}
                        deleteHiddenInputs={
                          <>
                            <input type="hidden" name="model" value="product" />
                            <input type="hidden" name="id" value={p.id} />
                            <input type="hidden" name="index" value={idx} />
                            <input
                              type="hidden"
                              name="returnTo"
                              value={searchParams.category ? `/admin/produits?category=${searchParams.category}` : "/admin/produits"}
                            />
                          </>
                        }
                        uploads={uploads}
                      />
                    ))}

                    {/* Add extra photo */}
                    <form
                      action={addListImage}
                      className="border-2 border-dashed border-stone-300 bg-stone-50/70 p-4 flex flex-col justify-center min-h-[200px]"
                    >
                      <input type="hidden" name="model" value="product" />
                      <input type="hidden" name="id" value={p.id} />
                      <input
                        type="hidden"
                        name="returnTo"
                        value={searchParams.category ? `/admin/produits?category=${searchParams.category}` : "/admin/produits"}
                      />
                      <div className="text-center mb-2">
                        <Plus className="w-6 h-6 text-stone-400 mx-auto" />
                        <p className="text-xs text-stone-700 font-semibold mt-1">Ajouter une photo supplémentaire</p>
                      </div>
                      <ImageSourcePicker uploads={uploads} showLibrary={false} />
                      <SaveButton label="Ajouter cette photo" variant="outline" className="mt-2" />
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
