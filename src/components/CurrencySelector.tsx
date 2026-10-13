"use client";

import { useCurrency, Currency } from "@/lib/CurrencyContext";
import { Globe } from "lucide-react";

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="relative inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 bg-sand/80 hover:bg-stone-100 border border-stone-200 rounded-full px-2.5 py-1 transition-colors">
      <Globe className="w-3.5 h-3.5 text-primary" />
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as Currency)}
        className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer text-stone-800"
        aria-label="Sélectionner la devise"
      >
        <option value="MAD">MAD (د.م)</option>
        <option value="EUR">EUR (€)</option>
        <option value="USD">USD ($)</option>
      </select>
    </div>
  );
}
