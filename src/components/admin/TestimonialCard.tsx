"use client";

import { useState } from "react";
import { Star, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { updateTestimonial, deleteTestimonial } from "@/app/admin/actions";
import SaveButton from "./SaveButton";

interface TestimonialCardProps {
  id: string;
  name: string;
  role: string;
  content: string;
  rating?: string | null;
  tab?: string;
}

export default function TestimonialCard({
  id,
  name,
  role,
  content,
  rating = "5",
  tab = "accueil",
}: TestimonialCardProps) {
  const [editing, setEditing] = useState(false);
  const ratingNum = rating && !isNaN(Number(rating)) ? Math.min(5, Math.max(1, Number(rating))) : 5;

  return (
    <div className="border border-stone-200 bg-white p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: ratingNum }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-[10px] uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Avis vérifié
          </span>
        </div>

        <p className="text-xs text-stone-700 italic leading-relaxed mb-4">
          &ldquo;{content}&rdquo;
        </p>
      </div>

      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h4 className="text-xs font-semibold text-stone-900 truncate">{name}</h4>
          <p className="text-[10px] text-stone-500 truncate">{role || "Client vérifié"}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            title="Modifier cet avis"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <form action={deleteTestimonial}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="tab" value={tab} />
            <button
              type="submit"
              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Supprimer cet avis"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {editing && (
        <form action={updateTestimonial} className="mt-4 pt-3 border-t border-stone-200 space-y-2">
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="tab" value={tab} />

          <div>
            <label className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1">Nom du client</label>
            <input name="name" defaultValue={name} required className="input w-full" />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1">
              Ville, Pays • Produit commandé
            </label>
            <input
              name="role"
              defaultValue={role}
              placeholder="Ex: Paris, France • Tapis Beni Ouarain"
              className="input w-full"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1">Note (1 à 5 étoiles)</label>
            <select name="rating" defaultValue={ratingNum.toString()} className="input w-full">
              <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
              <option value="4">⭐⭐⭐⭐ (4/5)</option>
              <option value="3">⭐⭐⭐ (3/5)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1">Texte de l&apos;avis</label>
            <textarea name="content" rows={3} defaultValue={content} required className="input w-full" />
          </div>

          <div className="flex gap-2 pt-1">
            <SaveButton label="Enregistrer" />
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="btn-outline px-3 py-1.5 text-xs"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
