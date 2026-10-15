import Link from "next/link";
import { ArrowLeft, Check, ExternalLink, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getUploads } from "@/lib/adminUploads";
import { updateSiteImage, updateEntity } from "../actions";
import ImageCard from "@/components/admin/ImageCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin • Magazine" };

export default async function AdminMagazinePage({
  searchParams,
}: {
  searchParams: { saved?: string };
}) {
  const [stories, homeMagazineImage, bannerMagazine, uploads] = await Promise.all([
    prisma.story.findMany({ orderBy: { title: "asc" } }),
    prisma.siteImage.findUnique({ where: { key: "section-magazine" } }),
    prisma.siteImage.findUnique({ where: { key: "banner-magazine" } }),
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
        <span className="text-stone-900 font-semibold">Magazine &amp; Récits</span>
      </nav>

      {/* Header */}
      <div className="mb-8 border-b border-stone-200/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A84C2C] font-semibold flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Culture &amp; Récits
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">{stories.length} articles</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Magazine &amp; Récits Culturels
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-light">
            Gérez les articles culturels du magazine ainsi que l&apos;encart aperçu affiché sur la page d&apos;accueil.
          </p>
        </div>

        <Link
          href="/magazine"
          target="_blank"
          className="btn-outline flex items-center gap-2 text-xs py-2 px-3 self-start sm:self-auto hover:border-stone-900"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#A84C2C]" />
          <span>Voir le magazine</span>
        </Link>
      </div>

      {/* Success Notification */}
      {searchParams.saved === "1" && (
        <div className="mb-8 border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs sm:text-sm px-4 py-3 flex items-center gap-2 shadow-sm animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Contenus du magazine mis à jour avec succès.</span>
        </div>
      )}

      {/* Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {homeMagazineImage && (
          <div className="border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="font-serif font-bold text-stone-900 text-sm mb-1">
              Encart Magazine (Page d&apos;Accueil)
            </h3>
            <p className="text-xs text-stone-500 mb-3 font-light">
              Photo d&apos;invitation affichée dans la section sombre en bas de la page d&apos;accueil.
            </p>
            <ImageCard
              src={homeMagazineImage.src}
              alt={homeMagazineImage.label}
              title={homeMagazineImage.label}
              description={homeMagazineImage.description ?? "Section « Le Maroc, terre d'art et de tradition »"}
              descriptionLabel="Légende"
              badges={[{ label: "Accueil • Bas de page", variant: "primary" }]}
              editAction={updateSiteImage}
              editHiddenInputs={
                <>
                  <input type="hidden" name="id" value={homeMagazineImage.id} />
                  <input type="hidden" name="returnTo" value="/admin/magazine" />
                </>
              }
              uploads={uploads}
            />
          </div>
        )}

        {bannerMagazine && (
          <div className="border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="font-serif font-bold text-stone-900 text-sm mb-1">
              Bannière d&apos;En-tête (Page Magazine)
            </h3>
            <p className="text-xs text-stone-500 mb-3 font-light">
              Grande image de couverture affichée en haut de la page /magazine.
            </p>
            <ImageCard
              src={bannerMagazine.src}
              alt={bannerMagazine.label}
              title={bannerMagazine.label}
              description={bannerMagazine.description ?? "Bannière en-tête"}
              descriptionLabel="Description"
              badges={[{ label: "Page Magazine", variant: "muted" }]}
              editAction={updateSiteImage}
              editHiddenInputs={
                <>
                  <input type="hidden" name="id" value={bannerMagazine.id} />
                  <input type="hidden" name="returnTo" value="/admin/magazine" />
                </>
              }
              uploads={uploads}
            />
          </div>
        )}
      </div>

      {/* Stories Grid */}
      <div>
        <h2 className="text-sm font-serif font-bold text-stone-900 uppercase tracking-wider mb-4">
          Articles du Magazine ({stories.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stories.map((s) => (
            <ImageCard
              key={s.id}
              src={s.image}
              alt={s.title}
              title={s.title}
              description={s.excerpt}
              descriptionLabel="Résumé de l'article"
              badges={[{ label: "Article", variant: "muted" }, { label: s.category }]}
              editAction={updateEntity}
              editHiddenInputs={
                <>
                  <input type="hidden" name="model" value="story" />
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="returnTo" value="/admin/magazine" />
                </>
              }
              uploads={uploads}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
