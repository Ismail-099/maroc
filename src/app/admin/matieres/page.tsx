import Link from "next/link";
import { ArrowLeft, Check, ExternalLink, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getUploads } from "@/lib/adminUploads";
import { updateSiteImage } from "../actions";
import ImageCard from "@/components/admin/ImageCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin • Matières Nobles" };

export default async function AdminMatieresPage({
  searchParams,
}: {
  searchParams: { saved?: string };
}) {
  const [materialImages, uploads] = await Promise.all([
    prisma.siteImage.findMany({
      where: { key: { startsWith: "material-" } },
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
        <span className="text-stone-900 font-semibold">Matières Nobles</span>
      </nav>

      {/* Header */}
      <div className="mb-8 border-b border-stone-200/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A84C2C] font-semibold">
              Accueil • Savoir-Faire
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">4 Matières Vivantes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Matières Nobles &amp; Savoir-Faire
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-light">
            Gérez les photos et les secrets de fabrication pour la Laine Vierge, l&apos;Argile, le Bois de Cèdre et le Cuir Végétal.
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
          <span>Matières nobles mises à jour avec succès.</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {materialImages.map((img) => (
          <ImageCard
            key={img.id}
            src={img.src}
            alt={img.label}
            title={img.label.replace("Matière - ", "")}
            description={img.description ?? ""}
            descriptionLabel="Secret de fabrication / Description"
            badges={[
              { label: "Matière Noble", variant: "accent" },
              { label: "Accueil", variant: "muted" },
            ]}
            editAction={updateSiteImage}
            editHiddenInputs={
              <>
                <input type="hidden" name="id" value={img.id} />
                <input type="hidden" name="returnTo" value="/admin/matieres" />
              </>
            }
            uploads={uploads}
          />
        ))}
      </div>
    </div>
  );
}
