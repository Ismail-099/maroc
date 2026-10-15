import Link from "next/link";
import { ArrowLeft, Check, ExternalLink, Camera } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getUploads } from "@/lib/adminUploads";
import { updateSiteImage } from "../actions";
import ImageCard from "@/components/admin/ImageCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin • Section Histoire" };

export default async function AdminHistoirePage({
  searchParams,
}: {
  searchParams: { saved?: string };
}) {
  const [storyImage, uploads] = await Promise.all([
    prisma.siteImage.findUnique({ where: { key: "section-story" } }),
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
        <span className="text-stone-900 font-semibold">Section Histoire</span>
      </nav>

      {/* Header */}
      <div className="mb-8 border-b border-stone-200/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A84C2C] font-semibold">
              Accueil • Récit &amp; Valeurs
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">Section « Une histoire humaine »</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Section Histoire &amp; Savoir-faire
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-light">
            Personnalisez la photo d&apos;ambiance illustrant l&apos;artisanat millénaire et l&apos;impact humain.
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
          <span>Image de la section Histoire mise à jour avec succès.</span>
        </div>
      )}

      {storyImage ? (
        <div className="max-w-xl">
          <ImageCard
            src={storyImage.src}
            alt={storyImage.label}
            title={storyImage.label}
            description={storyImage.description ?? "Section « Plus qu'un produit, une histoire humaine »"}
            descriptionLabel="Légende / Note pour cette photo"
            badges={[{ label: "Accueil • Histoire", variant: "primary" }]}
            editAction={updateSiteImage}
            editHiddenInputs={
              <>
                <input type="hidden" name="id" value={storyImage.id} />
                <input type="hidden" name="returnTo" value="/admin/histoire" />
              </>
            }
            uploads={uploads}
          />
        </div>
      ) : (
        <p className="text-sm text-stone-400">Aucun enregistrement trouvé pour section-story.</p>
      )}
    </div>
  );
}
