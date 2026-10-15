import Link from "next/link";
import {
  ExternalLink,
  LayoutGrid,
  Sparkles,
  Camera,
  Star,
  Layers,
  ShoppingBag,
  Hammer,
  BookOpen,
  LibraryBig,
  ArrowRight,
  Shield,
  FileText,
  Images,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getUploads } from "@/lib/adminUploads";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin • Tableau de Bord" };

export default async function AdminDashboardPage() {
  const [
    heroCount,
    materialCount,
    inspirationCount,
    categoryCount,
    productCount,
    artisanCount,
    reviewCount,
    storyCount,
    uploads,
  ] = await Promise.all([
    prisma.siteImage.count({ where: { key: { startsWith: "hero-" } } }),
    prisma.siteImage.count({ where: { key: { startsWith: "material-" } } }),
    prisma.siteImage.count({ where: { key: { startsWith: "inspiration-" } } }),
    prisma.category.count(),
    prisma.product.count(),
    prisma.artisan.count(),
    prisma.testimonial.count(),
    prisma.story.count(),
    getUploads(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      {/* Header */}
      <div className="mb-10 border-b border-stone-200/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A84C2C] font-semibold flex items-center gap-1">
              <Shield className="w-3 h-3" /> Espace Administration
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">Haute Artisanat Marocain</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Tableau de Bord
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-light">
            Chaque section du site dispose de sa page d&apos;administration dédiée pour une gestion claire et isolée.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="btn-outline flex items-center gap-2 text-xs py-2 px-3 self-start md:self-auto hover:border-stone-900"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#A84C2C]" />
          <span>Voir la boutique en direct</span>
        </Link>
      </div>

      {/* Group 1: Sections de la Page d'Accueil */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200">
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#A84C2C]" />
              Sections de la Page d&apos;Accueil
            </h2>
            <p className="text-xs text-stone-500 font-light mt-0.5">
              Éditez chaque bloc visuel de la page principale sur sa page dédiée.
            </p>
          </div>
          <span className="text-xs text-stone-400">4 modules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Hero */}
          <Link
            href="/admin/hero"
            className="group bg-white border border-stone-200 p-5 hover:border-stone-900 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded bg-stone-100 flex items-center justify-center text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono uppercase bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                  {heroCount} slides
                </span>
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-base mb-1 group-hover:text-[#A84C2C] transition-colors">
                Diaporama Hero
              </h3>
              <p className="text-xs text-stone-500 font-light leading-relaxed mb-4">
                Grandes photographies de couverture, activation et textes défilants en tête du site.
              </p>
            </div>
            <div className="text-xs font-semibold text-stone-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Gérer le diaporama</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A84C2C]" />
            </div>
          </Link>

          {/* Histoire */}
          <Link
            href="/admin/histoire"
            className="group bg-white border border-stone-200 p-5 hover:border-stone-900 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded bg-stone-100 flex items-center justify-center text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono uppercase bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                  Actif
                </span>
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-base mb-1 group-hover:text-[#A84C2C] transition-colors">
                Histoire &amp; Savoir-faire
              </h3>
              <p className="text-xs text-stone-500 font-light leading-relaxed mb-4">
                Section « Une histoire humaine », photo d&apos;ambiance des maîtres artisans.
              </p>
            </div>
            <div className="text-xs font-semibold text-stone-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Gérer l&apos;histoire</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A84C2C]" />
            </div>
          </Link>

          {/* Matières */}
          <Link
            href="/admin/matieres"
            className="group bg-white border border-stone-200 p-5 hover:border-stone-900 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded bg-stone-100 flex items-center justify-center text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono uppercase bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                  {materialCount} matières
                </span>
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-base mb-1 group-hover:text-[#A84C2C] transition-colors">
                Matières Nobles
              </h3>
              <p className="text-xs text-stone-500 font-light leading-relaxed mb-4">
                Les 4 piliers : Laine Vierge, Argile de Safi, Cèdre/Thuya et Cuir Végétal.
              </p>
            </div>
            <div className="text-xs font-semibold text-stone-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Gérer les matières</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A84C2C]" />
            </div>
          </Link>

          {/* Inspirations */}
          <Link
            href="/admin/inspirations"
            className="group bg-white border border-stone-200 p-5 hover:border-stone-900 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded bg-stone-100 flex items-center justify-center text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  <Camera className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono uppercase bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                  {inspirationCount} photos
                </span>
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-base mb-1 group-hover:text-[#A84C2C] transition-colors">
                Inspirations Déco
              </h3>
              <p className="text-xs text-stone-500 font-light leading-relaxed mb-4">
                Galerie #ArtisanatMarocChezVous, intérieurs clients, comptes Instagram et villes.
              </p>
            </div>
            <div className="text-xs font-semibold text-stone-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Gérer les inspirations</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A84C2C]" />
            </div>
          </Link>
        </div>
      </div>

      {/* Group 2: Catalogue & Boutique */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200">
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-stone-900" />
              Catalogue &amp; Produits
            </h2>
            <p className="text-xs text-stone-500 font-light mt-0.5">
              Gestion de votre inventaire, galeries multi-angles et collections.
            </p>
          </div>
          <span className="text-xs text-stone-400">2 modules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Collections */}
          <Link
            href="/admin/collections"
            className="group bg-white border border-stone-200 p-5 hover:border-stone-900 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded bg-stone-100 flex items-center justify-center text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono uppercase bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                  {categoryCount} catégories
                </span>
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-base mb-1 group-hover:text-[#A84C2C] transition-colors">
                Collections &amp; Catégories
              </h3>
              <p className="text-xs text-stone-500 font-light leading-relaxed mb-4">
                Bannière de la page catalogue, photos de couverture et descriptions des 6 univers artisanaux.
              </p>
            </div>
            <div className="text-xs font-semibold text-stone-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Gérer les collections</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A84C2C]" />
            </div>
          </Link>

          {/* Produits */}
          <Link
            href="/admin/produits"
            className="group bg-white border border-stone-200 p-5 hover:border-stone-900 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded bg-stone-100 flex items-center justify-center text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono uppercase bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                  {productCount} produits
                </span>
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-base mb-1 group-hover:text-[#A84C2C] transition-colors">
                Produits du Catalogue
              </h3>
              <p className="text-xs text-stone-500 font-light leading-relaxed mb-4">
                Fiches détaillées, galeries d&apos;images (ajout/suppression), descriptions et prix en Dirhams.
              </p>
            </div>
            <div className="text-xs font-semibold text-stone-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Gérer les produits</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A84C2C]" />
            </div>
          </Link>
        </div>
      </div>

      {/* Group 3: Communauté & Contenus */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200">
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-stone-400" />
              Contenus, Artisans &amp; Médias
            </h2>
            <p className="text-xs text-stone-500 font-light mt-0.5">
              Témoignages, récits du magazine, créateurs et fichiers importés.
            </p>
          </div>
          <span className="text-xs text-stone-400">4 modules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Avis */}
          <Link
            href="/admin/avis"
            className="group bg-white border border-stone-200 p-5 hover:border-stone-900 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded bg-stone-100 flex items-center justify-center text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <span className="text-[10px] font-mono uppercase bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                  {reviewCount} avis
                </span>
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-base mb-1 group-hover:text-[#A84C2C] transition-colors">
                Avis Clients
              </h3>
              <p className="text-xs text-stone-500 font-light leading-relaxed mb-4">
                Témoignages vérifiés 5 étoiles affichés en réassurance sur l&apos;accueil.
              </p>
            </div>
            <div className="text-xs font-semibold text-stone-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Gérer les avis</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A84C2C]" />
            </div>
          </Link>

          {/* Artisans */}
          <Link
            href="/admin/artisans"
            className="group bg-white border border-stone-200 p-5 hover:border-stone-900 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded bg-stone-100 flex items-center justify-center text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  <Hammer className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono uppercase bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                  {artisanCount} créateurs
                </span>
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-base mb-1 group-hover:text-[#A84C2C] transition-colors">
                Artisans &amp; Profils
              </h3>
              <p className="text-xs text-stone-500 font-light leading-relaxed mb-4">
                Biographies, régions de fabrication, spécialités et photos de profil.
              </p>
            </div>
            <div className="text-xs font-semibold text-stone-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Gérer les artisans</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A84C2C]" />
            </div>
          </Link>

          {/* Magazine */}
          <Link
            href="/admin/magazine"
            className="group bg-white border border-stone-200 p-5 hover:border-stone-900 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded bg-stone-100 flex items-center justify-center text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono uppercase bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                  {storyCount} articles
                </span>
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-base mb-1 group-hover:text-[#A84C2C] transition-colors">
                Magazine Culturel
              </h3>
              <p className="text-xs text-stone-500 font-light leading-relaxed mb-4">
                Articles, photos de récits et encart aperçu au bas de l&apos;accueil.
              </p>
            </div>
            <div className="text-xs font-semibold text-stone-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Gérer le magazine</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A84C2C]" />
            </div>
          </Link>

          {/* Médiathèque */}
          <Link
            href="/admin/mediatheque"
            className="group bg-white border border-stone-200 p-5 hover:border-stone-900 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded bg-stone-100 flex items-center justify-center text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  <LibraryBig className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono uppercase bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                  {uploads.length} fichiers
                </span>
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-base mb-1 group-hover:text-[#A84C2C] transition-colors">
                Médiathèque
              </h3>
              <p className="text-xs text-stone-500 font-light leading-relaxed mb-4">
                Fichiers téléversés sur le serveur, liens à copier et gestion du stockage.
              </p>
            </div>
            <div className="text-xs font-semibold text-stone-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Gérer les médias</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A84C2C]" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
