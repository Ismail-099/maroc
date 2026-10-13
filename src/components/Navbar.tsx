"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingBag, Heart, Menu, X } from "lucide-react";
import CurrencySelector from "@/components/CurrencySelector";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/magazine", label: "Magazine" },
  { href: "/artisans", label: "Artisans" },
  { href: "/a-propos", label: "A propos" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl md:text-2xl font-serif font-bold text-stone-900 tracking-wider uppercase">Artisanat Maroc</span>
          </Link>

          <nav className="hidden md:flex items-center gap-9">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-widest font-medium text-stone-600 hover:text-stone-950 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <CurrencySelector />
            <button className="p-2.5 hover:bg-stone-50 transition-colors" aria-label="Rechercher">
              <Search className="w-4 h-4 text-stone-700 hover:text-stone-950 transition-colors" />
            </button>
            <button className="p-2.5 hover:bg-stone-50 transition-colors" aria-label="Favoris">
              <Heart className="w-4 h-4 text-stone-700 hover:text-red-500 transition-colors" />
            </button>
            <button className="p-2.5 hover:bg-stone-50 transition-colors relative" aria-label="Panier">
              <ShoppingBag className="w-4 h-4 text-stone-700 hover:text-stone-950 transition-colors" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-stone-900 text-white text-[9px] font-bold flex items-center justify-center">0</span>
            </button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <CurrencySelector />
            <button className="p-2" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-sand-light border-t border-stone-200">
          <nav className="flex flex-col px-4 py-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-stone-700 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
