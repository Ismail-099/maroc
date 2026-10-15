"use client";

import { useRef, useState } from "react";
import { Upload, Link as LinkIcon, Image as ImageIcon, Check, X } from "lucide-react";

export default function ImageSourcePicker({
  defaultValue = "",
  uploads = [],
  showLibrary = true,
}: {
  defaultValue?: string;
  uploads?: string[];
  showLibrary?: boolean;
}) {
  const [mode, setMode] = useState<"file" | "url" | "library">("file");
  const [src, setSrc] = useState(defaultValue);
  const [fileLabel, setFileLabel] = useState("");
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const fileRef = useRef<HTMLInputElement>(null);

  const clearFile = () => {
    if (fileRef.current) fileRef.current.value = "";
    setFileLabel("");
    setPreview(null);
  };

  return (
    <div className="w-full bg-stone-50 border border-stone-200 p-3 rounded-none">
      {/* Hidden input keeping the selected URL/src */}
      <input type="hidden" name="src" value={src} />

      {/* Mode Selector Tabs */}
      <div className="flex border-b border-stone-200 pb-2 mb-3 gap-2 text-xs">
        <button
          type="button"
          onClick={() => {
            setMode("file");
            if (fileLabel) setSrc("");
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-medium transition-colors ${
            mode === "file"
              ? "bg-stone-900 text-white"
              : "bg-white text-stone-600 hover:text-stone-900 border border-stone-200"
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Fichier depuis mon PC</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("url");
            clearFile();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-medium transition-colors ${
            mode === "url"
              ? "bg-stone-900 text-white"
              : "bg-white text-stone-600 hover:text-stone-900 border border-stone-200"
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Lien internet (URL)</span>
        </button>

        {showLibrary && uploads.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setMode("library");
              clearFile();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium transition-colors ${
              mode === "library"
                ? "bg-stone-900 text-white"
                : "bg-white text-stone-600 hover:text-stone-900 border border-stone-200"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Médiathèque ({uploads.length})</span>
          </button>
        )}
      </div>

      {/* Mode 1: File Upload */}
      {mode === "file" && (
        <div>
          <label className="border-2 border-dashed border-stone-300 hover:border-stone-900 bg-white p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group">
            <Upload className="w-6 h-6 text-stone-400 group-hover:text-stone-900 transition-colors mb-1.5" />
            <span className="text-xs font-semibold text-stone-900">
              {fileLabel ? "Changer de fichier" : "Cliquez ici pour choisir une photo"}
            </span>
            <span className="text-[11px] text-stone-400 mt-0.5">Formats acceptés : JPG, PNG, WEBP</span>
            <input
              ref={fileRef}
              type="file"
              name="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setFileLabel(f.name);
                setPreview(URL.createObjectURL(f));
                setSrc("");
              }}
            />
          </label>
        </div>
      )}

      {/* Mode 2: URL Input */}
      {mode === "url" && (
        <div className="space-y-1.5">
          <label className="text-[11px] text-stone-500 font-medium block">
            Collez le lien direct vers votre image (ex: Unsplash, Pexels ou votre hébergeur)
          </label>
          <input
            value={src}
            onChange={(e) => {
              setSrc(e.target.value);
              setPreview(e.target.value || null);
            }}
            placeholder="https://images.unsplash.com/photo-..."
            className="input w-full"
          />
        </div>
      )}

      {/* Mode 3: Library selector */}
      {mode === "library" && (
        <div className="max-h-40 overflow-y-auto grid grid-cols-4 sm:grid-cols-6 gap-2 p-1 bg-white border border-stone-200">
          {uploads.map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => {
                setSrc(u);
                setPreview(u);
              }}
              className={`relative aspect-square border overflow-hidden transition-all ${
                src === u ? "border-[#A84C2C] ring-2 ring-[#A84C2C]" : "border-stone-200 hover:border-stone-400"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="upload" className="w-full h-full object-cover" />
              {src === u && (
                <div className="absolute inset-0 bg-[#A84C2C]/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white drop-shadow" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Live Preview Bar */}
      {preview && (
        <div className="mt-3 pt-2.5 border-t border-stone-200 flex items-center gap-3">
          <div className="relative w-12 h-12 bg-stone-200 border border-stone-300 shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-stone-900 truncate">
              {fileLabel || "Photo sélectionnée"}
            </p>
            <p className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" /> Prête à être enregistrée
            </p>
          </div>
          {(fileLabel || (mode === "url" && src)) && (
            <button
              type="button"
              onClick={() => {
                clearFile();
                setSrc("");
              }}
              className="p-1 text-stone-400 hover:text-stone-700"
              title="Supprimer la sélection"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
