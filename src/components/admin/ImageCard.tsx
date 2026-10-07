"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Trash2, Zap, ZapOff } from "lucide-react";
import ImageSourcePicker from "./ImageSourcePicker";
import SaveButton from "./SaveButton";

export type ImageCardBadge = {
  label: string;
  variant?: "dark" | "primary" | "accent" | "muted";
};

type ImageCardProps = {
  src: string;
  alt: string;
  title: string;
  description?: string;
  descriptionLabel?: string;
  badges?: ImageCardBadge[];
  status?: "active" | "inactive";
  uploads: string[];
  editAction: (fd: FormData) => Promise<void>;
  editHiddenInputs: React.ReactNode;
  deleteAction?: (fd: FormData) => Promise<void>;
  deleteHiddenInputs?: React.ReactNode;
  toggleAction?: (fd: FormData) => Promise<void>;
  toggleHiddenInputs?: React.ReactNode;
};

export default function ImageCard({
  src,
  alt,
  title,
  description = "",
  descriptionLabel = "Description",
  badges = [],
  status,
  uploads,
  editAction,
  editHiddenInputs,
  deleteAction,
  deleteHiddenInputs,
  toggleAction,
  toggleHiddenInputs,
}: ImageCardProps) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="bg-white border border-stone-200 overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <Image src={src} alt={alt} fill unoptimized className="object-cover" />
        {badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {badges.map((b, i) => (
              <span
                key={i}
                className={`text-[10px] uppercase tracking-wider text-white px-2 py-1 ${variantClass(b.variant)}`}
              >
                {b.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-medium text-stone-900 text-sm mb-1">{title}</h3>
        <p className="text-sm text-stone-500 line-clamp-2 flex-1">{description || <span className="italic">Aucune description</span>}</p>
        {status && (
          <div className="mt-3">
            <span
              className={`text-[10px] uppercase tracking-wider px-2 py-1 border ${
                status === "active"
                  ? "border-green-300 bg-green-50 text-green-700"
                  : "border-stone-200 bg-stone-50 text-stone-500"
              }`}
            >
              {status === "active" ? "Active" : "Inactive"}
            </span>
          </div>
        )}
      </div>

      {editing ? (
        <form action={editAction} className="border-t border-stone-100 p-3 space-y-2">
          {editHiddenInputs}
          <ImageSourcePicker defaultValue={src} uploads={uploads} />
          <div>
            <label className="text-[10px] uppercase tracking-wider text-stone-500 mb-1 block">{descriptionLabel}</label>
            <textarea name="description" rows={2} defaultValue={description} className="input" />
          </div>
          <div className="flex gap-2">
            <SaveButton />
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="btn-outline px-3 py-1.5 text-xs"
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <div className="border-t border-stone-100 p-3 flex items-center justify-between gap-2">
          {toggleAction && toggleHiddenInputs ? (
            <form action={toggleAction}>
              {toggleHiddenInputs}
              <button
                type="submit"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-colors ${
                  status === "active"
                    ? "bg-primary text-white border-primary hover:bg-primary/90"
                    : "border-stone-300 text-stone-700 hover:bg-sand"
                }`}
              >
                {status === "active" ? <Zap className="w-3.5 h-3.5" /> : <ZapOff className="w-3.5 h-3.5" />}
                {status === "active" ? "Active Hero" : "Set as Hero"}
              </button>
            </form>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="btn-outline p-2"
              title="Modifier"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            {deleteAction && deleteHiddenInputs && (
              <form action={deleteAction}>
                {deleteHiddenInputs}
                <button type="submit" className="btn-danger p-2" title="Supprimer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function variantClass(variant?: ImageCardBadge["variant"]) {
  switch (variant) {
    case "primary":
      return "bg-primary";
    case "accent":
      return "bg-accent";
    case "muted":
      return "bg-stone-500/80";
    default:
      return "bg-stone-900/80";
  }
}
