"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";

export default function ImageSourcePicker({
  defaultValue = "",
  uploads,
  showLibrary = true,
}: {
  defaultValue?: string;
  uploads: string[];
  showLibrary?: boolean;
}) {
  const [src, setSrc] = useState(defaultValue);
  const [fileLabel, setFileLabel] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const clearFile = () => {
    if (fileRef.current) fileRef.current.value = "";
    setFileLabel("");
    setPreview(null);
  };

  return (
    <div className="flex flex-1 min-w-0 flex-col gap-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          name="src"
          value={src}
          onChange={(e) => {
            setSrc(e.target.value);
            clearFile();
          }}
          placeholder="https://... ou /uploads/..."
          className="input"
        />
        <div className="flex gap-2">
          {showLibrary && (
            <select
              className="input sm:w-44 shrink-0"
              value=""
              onChange={(e) => {
                if (!e.target.value) return;
                setSrc(e.target.value);
                clearFile();
              }}
            >
              <option value="">Images importees...</option>
              {uploads.map((u) => (
                <option key={u} value={u}>
                  {u.split("/").pop()}
                </option>
              ))}
            </select>
          )}
          <label className="btn-outline flex items-center gap-1 cursor-pointer shrink-0">
            <Upload className="w-3.5 h-3.5" />
            <span className="max-w-28 truncate">{fileLabel || "Importer"}</span>
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
      </div>
      {(preview || fileLabel) && (
        <div className="flex items-center gap-2 text-xs text-stone-600">
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Apercu" className="w-10 h-10 object-cover border border-stone-200" />
          )}
          <span>Fichier selectionne : {fileLabel}</span>
        </div>
      )}
    </div>
  );
}
