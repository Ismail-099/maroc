"use client";

import { useFormStatus } from "react-dom";
import { Check, Loader2 } from "lucide-react";

export default function SaveButton({
  label = "Modifier",
  variant = "dark",
  className = "",
}: {
  label?: string;
  variant?: "dark" | "outline";
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${variant === "dark" ? "btn-dark" : "btn-outline"} ${className} flex items-center gap-1.5 shrink-0 disabled:opacity-60`}
    >
      {pending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Check className="w-3.5 h-3.5" />
      )}
      {pending ? "Modification..." : label}
    </button>
  );
}
