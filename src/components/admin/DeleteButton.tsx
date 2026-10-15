"use client";

import { Trash2 } from "lucide-react";

export default function DeleteButton({
  action,
  id,
  confirmMessage,
  label = "Supprimer",
  className = "",
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  confirmMessage: string;
  label?: string;
  className?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className={`btn-danger flex items-center gap-1 py-1.5 px-2.5 text-xs ${className}`}
        title={label}
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>{label}</span>
      </button>
    </form>
  );
}
