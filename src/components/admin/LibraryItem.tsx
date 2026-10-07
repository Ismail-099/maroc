"use client";

import { useState } from "react";
import { Copy, Check, Trash2 } from "lucide-react";
import { deleteUploadedFile } from "@/app/admin/actions";

export default function LibraryItem({ src }: { src: string }) {
  const [copied, setCopied] = useState(false);
  const name = src.split("/").pop() ?? src;

  return (
    <div className="border border-stone-200 bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={name} className="w-full h-28 object-cover bg-stone-100" />
      <div className="p-2">
        <p className="text-[10px] text-stone-500 truncate mb-2" title={name}>{name}</p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(src).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              });
            }}
            className="btn-outline flex-1 flex items-center justify-center gap-1"
          >
            {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copie" : "Copier"}
          </button>
          <form action={deleteUploadedFile}>
            <input type="hidden" name="src" value={src} />
            <button type="submit" className="btn-danger" title="Supprimer le fichier">
              <Trash2 className="w-3 h-3" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
