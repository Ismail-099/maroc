"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  ExternalLink,
  LogOut,
  Menu,
  X,
  Home,
  Layers,
  ShoppingBag,
  Hammer,
  Star,
  BookOpen,
  LibraryBig,
  Shield,
  ArrowLeft,
  Sparkles,
  Camera,
  LayoutGrid,
  FileText,
  ChevronDown,
} from "lucide-react";
import { logout } from "@/app/admin/login/actions";

interface NavGroup {
  label: string;
  id: string;
  items: {
    href: string;
    label: string;
    description: string;
    icon: any;
  }[];
}

const navGroups: NavGroup[] = [
  {
    label: "Page d'Accueil",
    id: "accueil",
    items: [
      {
        href: "/admin/hero",
        label: "Diaporama Hero",
        description: "Carrousel et bannières principales",
        icon: LayoutGrid,
      },
      {
        href: "/admin/histoire",
        label: "Histoire & Savoir-faire",
        description: "Section récit des artisans",
        icon: FileText,
      },
      {
        href: "/admin/matieres",
        label: "Matières Nobles",
        description: "4 matières vivantes (Laine, Argile...)",
        icon: Sparkles,
      },
      {
        href: "/admin/inspirations",
        label: "Inspirations Déco",
        description: "Galerie Instagram clients",
        icon: Camera,
      },
    ],
  },
  {
    label: "Catalogue",
    id: "catalogue",
    items: [
      {
        href: "/admin/collections",
        label: "Collections & Catégories",
        description: "Bannière et 6 univers artisanaux",
        icon: Layers,
      },
      {
        href: "/admin/produits",
        label: "Produits du Catalogue",
        description: "Fiches, prix et galeries photos",
        icon: ShoppingBag,
      },
    ],
  },
  {
    label: "Contenus & Médias",
    id: "contenus",
    items: [
      {
        href: "/admin/avis",
        label: "Avis Clients",
        description: "Témoignages 5 étoiles certifiés",
        icon: Star,
      },
      {
        href: "/admin/artisans",
        label: "Artisans & Créateurs",
        description: "Biographies et spécialités",
        icon: Hammer,
      },
      {
        href: "/admin/magazine",
        label: "Magazine Culturel",
        description: "Articles et encart accueil",
        icon: BookOpen,
      },
      {
        href: "/admin/mediatheque",
        label: "Médiathèque",
        description: "Fichiers et images importées",
        icon: LibraryBig,
      },
    ],
  },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const isLoginPage = pathname === "/admin/login";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  const isGroupActive = (group: NavGroup) => {
    return group.items.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"));
  };

  return (
    <header className="sticky top-0 z-50 bg-stone-900 text-white border-b border-stone-800 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Admin Badge */}
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <span className="text-lg md:text-xl font-serif font-bold tracking-wider uppercase text-white group-hover:text-stone-300 transition-colors">
                Artisanat Maroc
              </span>
            </Link>
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold bg-[#A84C2C] text-white px-2 py-0.5 rounded-sm">
              <Shield className="w-3 h-3" />
              Admin
            </span>
          </div>

          {/* Compact Grouped Navigation */}
          {!isLoginPage ? (
            <>
              <nav ref={navRef} className="hidden md:flex items-center gap-1.5 lg:gap-3">
                {/* Dashboard Home */}
                <Link
                  href="/admin"
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs uppercase tracking-wider font-medium rounded-sm transition-colors ${
                    pathname === "/admin"
                      ? "bg-white/10 text-white font-semibold border-b-2 border-[#A84C2C]"
                      : "text-stone-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Home className="w-3.5 h-3.5 text-stone-400" />
                  <span>Tableau de bord</span>
                </Link>

                {/* Dropdown Groups */}
                {navGroups.map((group) => {
                  const active = isGroupActive(group);
                  const isOpen = openDropdown === group.id;

                  return (
                    <div key={group.id} className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(isOpen ? null : group.id)}
                        onMouseEnter={() => setOpenDropdown(group.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs uppercase tracking-wider font-medium rounded-sm transition-colors ${
                          active
                            ? "bg-white/10 text-white font-semibold border-b-2 border-[#A84C2C]"
                            : "text-stone-300 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span>{group.label}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-white" : ""
                          }`}
                        />
                      </button>

                      {/* Dropdown Menu */}
                      {isOpen && (
                        <div
                          onMouseLeave={() => setOpenDropdown(null)}
                          className="absolute top-full left-0 mt-1 w-64 bg-stone-900 border border-stone-800 shadow-2xl py-2 z-50 animate-fade-in"
                        >
                          <div className="px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-[#A84C2C] font-semibold border-b border-stone-800/80 mb-1">
                            {group.label}
                          </div>
                          {group.items.map((item) => {
                            const Icon = item.icon;
                            const isCurrent = pathname === item.href;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-start gap-3 px-3 py-2.5 hover:bg-stone-800/80 transition-colors ${
                                  isCurrent ? "bg-white/10 text-white" : "text-stone-300"
                                }`}
                              >
                                <Icon
                                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                                    isCurrent ? "text-[#A84C2C]" : "text-stone-400"
                                  }`}
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-white tracking-wide truncate">
                                    {item.label}
                                  </p>
                                  <p className="text-[10px] text-stone-400 font-light truncate">
                                    {item.description}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* Right Side Actions */}
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-stone-300 hover:text-white px-3 py-2 border border-stone-700 hover:border-stone-500 transition-colors"
                  title="Ouvrir la boutique dans un nouvel onglet"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#A84C2C]" />
                  <span>Voir la boutique</span>
                </Link>

                <form action={logout}>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 text-xs uppercase tracking-wider bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-2 transition-colors border border-stone-700"
                    title="Se déconnecter"
                  >
                    <LogOut className="w-3.5 h-3.5 text-stone-400" />
                    <span>Déconnexion</span>
                  </button>
                </form>
              </div>

              {/* Mobile Menu Button */}
              <div className="flex items-center gap-2 md:hidden">
                <Link
                  href="/"
                  target="_blank"
                  className="p-2 text-stone-300 hover:text-white"
                  title="Voir la boutique"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-stone-300 hover:text-white"
                  aria-label="Menu Admin"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </>
          ) : (
            /* Login Page Header Link */
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-stone-300 hover:text-white px-3 py-2 border border-stone-700 hover:border-stone-500 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à la boutique</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {!isLoginPage && mobileMenuOpen && (
        <div className="md:hidden bg-stone-950 border-t border-stone-800 px-4 py-4 space-y-3">
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs uppercase tracking-wider font-semibold rounded ${
              pathname === "/admin" ? "bg-white/10 text-white" : "text-stone-300"
            }`}
          >
            <Home className="w-4 h-4 text-[#A84C2C]" />
            <span>Tableau de bord</span>
          </Link>

          {navGroups.map((group) => {
            const isExpanded = mobileExpandedGroup === group.id;
            return (
              <div key={group.id} className="border-t border-stone-850 pt-2">
                <button
                  type="button"
                  onClick={() => setMobileExpandedGroup(isExpanded ? null : group.id)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold text-[#A84C2C]"
                >
                  <span>{group.label}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>

                {(isExpanded || isGroupActive(group)) && (
                  <div className="mt-1 space-y-1 pl-2">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isCurrent = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 text-xs uppercase tracking-wider rounded ${
                            isCurrent
                              ? "bg-white/10 text-white font-semibold"
                              : "text-stone-300 hover:text-white"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 text-stone-400" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
            <Link
              href="/"
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 text-xs text-stone-300 hover:text-white"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#A84C2C]" />
              <span>Voir la boutique</span>
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-400"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Déconnexion</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
