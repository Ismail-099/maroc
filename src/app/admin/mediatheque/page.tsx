import Link from "next/link";
import { ArrowLeft, Check, LibraryBig } from "lucide-react";
import { getUploads } from "@/lib/adminUploads";
import LibraryItem from "@/components/admin/LibraryItem";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin • Médiathèque" };

export default async function AdminMediathequePage({
  searchParams,
}: {
  searchParams: { saved?: string };
}) {
  const uploads = await getUploads();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
        <Link href="/admin" className="hover:text-stone-900 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Tableau de bord
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-semibold">Médiathèque</span>
      </nav>

      {/* Header */}
      <div className="mb-8 border-b border-stone-200/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A84C2C] font-semibold flex items-center gap-1">
              <LibraryBig className="w-3 h-3" /> Fichiers Locaux
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">{uploads.length} images importées</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Bibliothèque de Médias
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-light">
            Toutes les images téléversées depuis votre ordinateur vers le serveur (/public/uploads/). Cliquez sur « Copier » pour récupérer le chemin d&apos;accès.
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {searchParams.saved === "1" && (
        <div className="mb-8 border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs sm:text-sm px-4 py-3 flex items-center gap-2 shadow-sm animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Fichier supprimé de la médiathèque.</span>
        </div>
      )}

      {/* Files Grid */}
      {uploads.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {uploads.map((src) => (
            <LibraryItem key={src} src={src} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-stone-300 bg-white p-8">
          <LibraryBig className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <p className="text-sm text-stone-600 font-medium">Aucune image importée pour l&apos;instant</p>
          <p className="text-xs text-stone-400 mt-1">
            Utilisez le bouton « Importer » depuis n&apos;importe quelle carte d&apos;édition pour téléverser vos fichiers.
          </p>
        </div>
      )}
    </div>
  );
}
