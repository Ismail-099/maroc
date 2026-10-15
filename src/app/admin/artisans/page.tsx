import Link from "next/link";
import { ArrowLeft, Check, ExternalLink, Hammer } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getUploads } from "@/lib/adminUploads";
import { updateEntity, clearEntityImage } from "../actions";
import ImageCard from "@/components/admin/ImageCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin • Artisans" };

export default async function AdminArtisansPage({
  searchParams,
}: {
  searchParams: { saved?: string };
}) {
  const [artisans, uploads] = await Promise.all([
    prisma.artisan.findMany({ orderBy: { name: "asc" } }),
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
        <span className="text-stone-900 font-semibold">Artisans &amp; Créateurs</span>
      </nav>

      {/* Header */}
      <div className="mb-8 border-b border-stone-200/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A84C2C] font-semibold flex items-center gap-1">
              <Hammer className="w-3 h-3" /> Maîtres Artisans
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">{artisans.length} profils créateurs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Artisans &amp; Créateurs
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-light">
            Gérez les biographies d&apos;artisans, les spécialités traditionnelles et leurs photos de profil.
          </p>
        </div>

        <Link
          href="/artisans"
          target="_blank"
          className="btn-outline flex items-center gap-2 text-xs py-2 px-3 self-start sm:self-auto hover:border-stone-900"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#A84C2C]" />
          <span>Voir la page artisans</span>
        </Link>
      </div>

      {/* Success Notification */}
      {searchParams.saved === "1" && (
        <div className="mb-8 border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs sm:text-sm px-4 py-3 flex items-center gap-2 shadow-sm animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profils d&apos;artisans mis à jour avec succès.</span>
        </div>
      )}

      {/* Artisans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {artisans.map((a) => (
          <ImageCard
            key={a.id}
            src={a.image ?? ""}
            alt={a.name}
            title={`${a.name} (${a.region})`}
            description={a.bio ?? ""}
            descriptionLabel="Biographie de l'artisan"
            badges={[{ label: "Artisan", variant: "muted" }, { label: a.specialty }]}
            editAction={updateEntity}
            editHiddenInputs={
              <>
                <input type="hidden" name="model" value="artisan" />
                <input type="hidden" name="id" value={a.id} />
                <input type="hidden" name="returnTo" value="/admin/artisans" />
              </>
            }
            deleteAction={clearEntityImage}
            deleteHiddenInputs={
              <>
                <input type="hidden" name="model" value="artisan" />
                <input type="hidden" name="id" value={a.id} />
                <input type="hidden" name="returnTo" value="/admin/artisans" />
              </>
            }
            uploads={uploads}
          />
        ))}
      </div>
    </div>
  );
}
