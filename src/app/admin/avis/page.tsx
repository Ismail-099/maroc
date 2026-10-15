import Link from "next/link";
import { ArrowLeft, Check, ExternalLink, Star, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { addTestimonial } from "../actions";
import TestimonialCard from "@/components/admin/TestimonialCard";
import SaveButton from "@/components/admin/SaveButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin • Avis Clients" };

export default async function AdminAvisPage({
  searchParams,
}: {
  searchParams: { saved?: string };
}) {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { id: "asc" } });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
        <Link href="/admin" className="hover:text-stone-900 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Tableau de bord
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-semibold">Avis Clients</span>
      </nav>

      {/* Header */}
      <div className="mb-8 border-b border-stone-200/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A84C2C] font-semibold flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> Preuve Sociale
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">{testimonials.length} avis certifiés</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Avis Clients &amp; Témoignages Vérifiés
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-light">
            Gérez les avis de clients satisfaits affichés dans la section réassurance de la page d&apos;accueil.
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
          <span>Avis clients enregistrés avec succès.</span>
        </div>
      )}

      {/* Testimonials Grid */}
      <div className="mb-12">
        <h2 className="text-sm font-serif font-bold text-stone-900 uppercase tracking-wider mb-4">
          Témoignages Actifs ({testimonials.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <TestimonialCard
              key={t.id}
              id={t.id}
              name={t.name}
              role={t.role}
              content={t.content}
              rating={t.image}
              tab="avis"
            />
          ))}
        </div>
      </div>

      {/* Add Testimonial Form */}
      <div className="border border-stone-200 bg-white p-6 max-w-2xl shadow-sm">
        <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-1 flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#A84C2C]" /> Ajouter un avis client certifié
        </h3>
        <p className="text-xs text-stone-500 mb-4 font-light">
          Renseignez le nom, la ville et le commentaire du client pour l&apos;afficher directement sur le site.
        </p>

        <form action={addTestimonial} className="space-y-3">
          <input type="hidden" name="returnTo" value="/admin/avis" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1">
                Nom complet du client
              </label>
              <input
                name="name"
                required
                placeholder="Ex: Sophie Delaunay"
                className="input w-full"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1">
                Ville, Pays • Produit
              </label>
              <input
                name="role"
                placeholder="Ex: Paris, France • Tapis Beni Ouarain"
                className="input w-full"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1">
              Note attribuée
            </label>
            <select name="rating" defaultValue="5" className="input w-full sm:w-48">
              <option value="5">⭐⭐⭐⭐⭐ 5 étoiles (Excellent)</option>
              <option value="4">⭐⭐⭐⭐ 4 étoiles (Très bon)</option>
              <option value="3">⭐⭐⭐ 3 étoiles (Bon)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1">
              Témoignage du client
            </label>
            <textarea
              name="content"
              required
              rows={3}
              placeholder="Ex: Le tapis est une pure merveille. La laine est d'une douceur exceptionnelle..."
              className="input w-full"
            />
          </div>

          <SaveButton label="Ajouter l'avis" variant="dark" className="mt-2" />
        </form>
      </div>
    </div>
  );
}
