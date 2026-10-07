"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingBag, Heart, Menu, X } from "lucide-react";

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
    <header className="sticky top-0 z-50 bg-sand-light/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-serif font-bold text-primary">Artisanat Maroc</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-stone-600 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 hover:bg-stone-100 transition-colors">
              <Search className="w-5 h-5 text-stone-600" />
            </button>
            <button className="p-2 hover:bg-stone-100 transition-colors">
              <Heart className="w-5 h-5 text-stone-600" />
            </button>
            <button className="p-2 hover:bg-stone-100 transition-colors relative">
              <ShoppingBag className="w-5 h-5 text-stone-600" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] flex items-center justify-center">0</span>
            </button>
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
