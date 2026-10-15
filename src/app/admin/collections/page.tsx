import Link from "next/link";
import { ArrowLeft, Check, ExternalLink, Layers, Plus, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getUploads } from "@/lib/adminUploads";
import {
  createCategory,
  deleteCategory,
  updateSiteImage,
  updateEntity,
  updateListImage,
  deleteListImage,
  addListImage,
} from "../actions";
import ImageCard from "@/components/admin/ImageCard";
import ImageSourcePicker from "@/components/admin/ImageSourcePicker";
import SaveButton from "@/components/admin/SaveButton";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin • Collections" };

export default async function AdminCollectionsPage({
  searchParams,
}: {
  searchParams: { saved?: string };
}) {
  const [categories, catalogueBanner, uploads] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.siteImage.findUnique({ where: { key: "banner-catalogue" } }),
    getUploads(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
        <Link href="/admin" className="hover:text-stone-900 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Tableau de bord
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-semibold">Collections &amp; Catégories</span>
      </nav>

      {/* Header */}
      <div className="mb-8 border-b border-stone-200/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A84C2C] font-semibold flex items-center gap-1">
              <Layers className="w-3 h-3" /> Catalogue Boutique
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">{categories.length} univers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Collections &amp; Catégories
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-light">
            Créez de nouvelles catégories d&apos;artisanat, gérez leurs visuels de couverture et descriptions.
          </p>
        </div>

        <Link
          href="/catalogue"
          target="_blank"
          className="btn-outline flex items-center gap-2 text-xs py-2 px-3 self-start sm:self-auto hover:border-stone-900"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#A84C2C]" />
          <span>Voir le catalogue</span>
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
      {/* 1. CREATE NEW CATEGORY / COLLECTION FORM */}
      {/* ========================================================================= */}
      <div className="mb-12 border-2 border-stone-900 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-sm">
            +
          </div>
          <h2 className="text-lg font-serif font-bold text-stone-900">
            Créer une Nouvelle Catégorie / Collection
          </h2>
        </div>
        <p className="text-xs text-stone-500 mb-6 font-light">
          Ajoutez un nouvel univers artisanal (ex: Bijoux, Orfèvrerie, Miroirs...) qui apparaîtra dans le menu et le catalogue.
        </p>

        <form action={createCategory} className="space-y-4">
          <input type="hidden" name="returnTo" value="/admin/collections" />

          <div>
            <label className="text-xs font-semibold text-stone-800 block mb-1">
              Nom de la catégorie *
            </label>
            <input
              name="name"
              required
              placeholder="Ex: Bijoux & Orfèvrerie Traditionnelle"
              className="input w-full"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-800 block mb-1">
              Photo de couverture principale *
            </label>
            <ImageSourcePicker uploads={uploads} />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-800 block mb-1">
              Description de la catégorie
            </label>
            <textarea
              name="description"
              rows={2}
              placeholder="Ex: Bracelets en argent massif, fibules berbères et colliers ciselés à la main..."
              className="input w-full"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <SaveButton label="Créer la collection" variant="dark" className="py-2.5 px-6" />
          </div>
        </form>
      </div>

      {/* ========================================================================= */}
      {/* 2. CATALOGUE BANNER */}
      {/* ========================================================================= */}
      {catalogueBanner && (
        <div className="mb-12">
          <h2 className="text-sm font-serif font-bold text-stone-900 uppercase tracking-wider mb-2">
            Bannière Principale de la Page Catalogue
          </h2>
          <p className="text-xs text-stone-500 mb-4 font-light">
            Photo panoramique affichée en tête de la page publique /catalogue.
          </p>
          <div className="max-w-md">
            <ImageCard
              src={catalogueBanner.src}
              alt={catalogueBanner.label}
              title={catalogueBanner.label}
              description={catalogueBanner.description ?? "Grande bannière affichée en tête de /catalogue"}
              descriptionLabel="Description"
              badges={[{ label: "Page Catalogue", variant: "primary" }]}
              editAction={updateSiteImage}
              editHiddenInputs={
                <>
                  <input type="hidden" name="id" value={catalogueBanner.id} />
                  <input type="hidden" name="returnTo" value="/admin/collections" />
                </>
              }
              uploads={uploads}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. EXISTING CATEGORIES */}
      {/* ========================================================================= */}
      <div>
        <h2 className="text-base font-serif font-bold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>Toutes les Catégories</span>
          <span className="text-xs text-stone-400 font-sans font-normal">({categories.length})</span>
        </h2>

        <div className="space-y-6">
          {categories.map((cat) => {
            const list = cat.images
              ? cat.images.split("|").map((s) => s.trim()).filter(Boolean)
              : [];
            return (
              <div key={cat.id} className="border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3 border-b border-stone-100 pb-2">
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 text-lg">{cat.name}</h3>
                    <p className="text-xs text-stone-500">
                      {cat._count?.products ?? 0} produits &bull; slug: <span className="font-mono">{cat.slug}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/catalogue?category=${cat.slug}`}
                      target="_blank"
                      className="btn-outline flex items-center gap-1 text-xs py-1.5 px-2.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Voir sur le site</span>
                    </Link>

                    <DeleteButton
                      action={deleteCategory}
                      id={cat.id}
                      confirmMessage={`Supprimer la catégorie "${cat.name}" et tous les produits associés ?`}
                      label="Supprimer"
                    />
                  </div>
                </div>

                {/* Description form */}
                <form action={updateEntity} className="flex gap-2 items-start mb-4">
                  <input type="hidden" name="model" value="category" />
                  <input type="hidden" name="id" value={cat.id} />
                  <input type="hidden" name="returnTo" value="/admin/collections" />
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] uppercase tracking-wider text-stone-500 mb-1 block">
                      Description de la catégorie
                    </label>
                    <textarea
                      name="description"
                      rows={2}
                      defaultValue={cat.description ?? ""}
                      className="input w-full"
                    />
                  </div>
                  <SaveButton className="self-start mt-5" label="Sauvegarder" />
                </form>

                {/* Images grid */}
                <div>
                  <p className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    Photos de couverture ({list.length})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {list.map((src, idx) => (
                      <ImageCard
                        key={`${cat.id}-${idx}`}
                        src={src}
                        alt={cat.name}
                        title={`Couverture ${idx + 1}`}
                        badges={[{ label: cat.name, variant: "muted" }, { label: "Catégorie" }]}
                        editAction={updateListImage}
                        editHiddenInputs={
                          <>
                            <input type="hidden" name="model" value="category" />
                            <input type="hidden" name="id" value={cat.id} />
                            <input type="hidden" name="index" value={idx} />
                            <input type="hidden" name="returnTo" value="/admin/collections" />
                          </>
                        }
                        deleteAction={list.length > 1 ? deleteListImage : undefined}
                        deleteHiddenInputs={
                          <>
                            <input type="hidden" name="model" value="category" />
                            <input type="hidden" name="id" value={cat.id} />
                            <input type="hidden" name="index" value={idx} />
                            <input type="hidden" name="returnTo" value="/admin/collections" />
                          </>
                        }
                        uploads={uploads}
                      />
                    ))}

                    {/* Add image card */}
                    <form
                      action={addListImage}
                      className="border-2 border-dashed border-stone-300 bg-stone-50/70 p-4 flex flex-col justify-center min-h-[200px]"
                    >
                      <input type="hidden" name="model" value="category" />
                      <input type="hidden" name="id" value={cat.id} />
                      <input type="hidden" name="returnTo" value="/admin/collections" />
                      <div className="text-center mb-2">
                        <Plus className="w-6 h-6 text-stone-400 mx-auto" />
                        <p className="text-xs text-stone-700 font-semibold mt-1">Ajouter une photo de couverture</p>
                      </div>
                      <ImageSourcePicker uploads={uploads} showLibrary={false} />
                      <SaveButton label="Ajouter" variant="outline" className="mt-2" />
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
