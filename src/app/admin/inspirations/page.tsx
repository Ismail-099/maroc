import Link from "next/link";
import { ArrowLeft, Check, ExternalLink, Camera, Instagram } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getUploads } from "@/lib/adminUploads";
import { updateSiteImage } from "../actions";
import ImageCard from "@/components/admin/ImageCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin • Inspirations Déco" };

export default async function AdminInspirationsPage({
  searchParams,
}: {
  searchParams: { saved?: string };
}) {
  const [inspirationImages, uploads] = await Promise.all([
    prisma.siteImage.findMany({
      where: { key: { startsWith: "inspiration-" } },
      orderBy: { key: "asc" },
    }),
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
        <span className="text-stone-400">Page d&apos;Accueil</span>
        <span>/</span>
        <span className="text-stone-900 font-semibold">Inspirations Déco</span>
      </nav>

      {/* Header */}
      <div className="mb-8 border-b border-stone-200/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A84C2C] font-semibold flex items-center gap-1">
              <Instagram className="w-3 h-3" /> #ArtisanatMarocChezVous
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">4 Intérieurs Réels</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Galerie Inspirations Déco Instagram
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-light">
            Gérez les photos d&apos;ambiance clients, les comptes Instagram et les villes affichés dans la mosaïque d&apos;inspiration.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="btn-outline flex items-center gap-2 text-xs py-2 px-3 self-start sm:self-auto hover:border-stone-900"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#A84C2C]" />
          <span>Voir sur le site</span>
        </Link>
      </div>

      {/* Success Notification */}
      {searchParams.saved === "1" && (
        <div className="mb-8 border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs sm:text-sm px-4 py-3 flex items-center gap-2 shadow-sm animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Photos d&apos;inspirations mises à jour avec succès.</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {inspirationImages.map((img) => (
          <ImageCard
            key={img.id}
            src={img.src}
            alt={img.label}
            title={img.label}
            description={img.description ?? ""}
            descriptionLabel="Compte Instagram & Ville (format: @compte | Ville)"
            badges={[
              { label: "Instagram", variant: "dark" },
              { label: "Accueil", variant: "muted" },
            ]}
            editAction={updateSiteImage}
            editHiddenInputs={
              <>
                <input type="hidden" name="id" value={img.id} />
                <input type="hidden" name="returnTo" value="/admin/inspirations" />
              </>
            }
            uploads={uploads}
          />
        ))}
      </div>
    </div>
  );
}
