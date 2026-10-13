"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  X,
  Heart,
  Star,
  ArrowUpDown,
  Sparkles,
  MapPin,
  Check,
  ChevronRight,
  ChevronLeft,
  Layers,
  Filter,
  Eye,
  MessageCircle,
} from "lucide-react";
import FormattedPrice from "@/components/FormattedPrice";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  images: string | null;
  productCount: number;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice: number | null;
  images: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  material: string | null;
  dimensions: string | null;
  technique: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  artisan: {
    id: string;
    name: string;
    region: string;
    specialty: string;
  };
}

interface CatalogueClientProps {
  categories: CategoryItem[];
  initialProducts: ProductItem[];
  allRegions: string[];
  bannerUrl: string;
}

export default function CatalogueClient({
  categories,
  initialProducts,
  allRegions,
  bannerUrl,
}: CatalogueClientProps) {
  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [stockOnly, setStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("newest"); // "newest", "price-asc", "price-desc", "rating"
  const [activeGalleryIndices, setActiveGalleryIndices] = useState<Record<string, number>>({});
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "compact" | "large">("grid");
  const [quickFilter, setQuickFilter] = useState<"all" | "top-rated" | "in-stock" | "under-500" | "under-1000">("all");
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [quickViewImgIdx, setQuickViewImgIdx] = useState<number>(0);

  // Get active category object
  const currentCategory = useMemo(() => {
    if (selectedCategory === "all") return null;
    return categories.find((c) => c.slug === selectedCategory) || null;
  }, [selectedCategory, categories]);

  // Category gallery images (can contain multiple pipe-separated images)
  const categoryImages = useMemo(() => {
    if (!currentCategory || !currentCategory.images) return [];
    return currentCategory.images
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [currentCategory]);

  const [activeCatImgIndex, setActiveCatImgIndex] = useState(0);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category match
      if (selectedCategory !== "all" && product.category.slug !== selectedCategory) {
        return false;
      }

      // Region match
      if (selectedRegion !== "all" && product.artisan.region !== selectedRegion) {
        return false;
      }

      // Search match
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesArtisan = product.artisan.name.toLowerCase().includes(q);
        const matchesCat = product.category.name.toLowerCase().includes(q);
        const matchesMaterial = product.material ? product.material.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesDesc && !matchesArtisan && !matchesCat && !matchesMaterial) {
          return false;
        }
      }

      // Stock
      if (stockOnly && !product.inStock) {
        return false;
      }

      // Price
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Quick filter
      if (quickFilter === "top-rated" && product.rating < 4.8) {
        return false;
      }
      if (quickFilter === "in-stock" && !product.inStock) {
        return false;
      }
      if (quickFilter === "under-500" && product.price > 500) {
        return false;
      }
      if (quickFilter === "under-1000" && product.price > 1000) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // default order is newest from server
    });
  }, [initialProducts, selectedCategory, selectedRegion, searchQuery, stockOnly, priceRange, sortBy, quickFilter]);

  // Image cycling for each product
  const getProductImage = (productId: string, rawImages: string) => {
    const list = rawImages.split("|").map((s) => s.trim()).filter(Boolean);
    const currentIndex = activeGalleryIndices[productId] || 0;
    return {
      currentUrl: list[currentIndex] || list[0],
      totalCount: list.length,
      currentIndex,
    };
  };

  const handleNextProductImage = (e: React.MouseEvent, productId: string, total: number) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveGalleryIndices((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % total,
    }));
  };

  const handlePrevProductImage = (e: React.MouseEvent, productId: string, total: number) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveGalleryIndices((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + total) % total,
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedRegion("all");
    setSearchQuery("");
    setPriceRange([0, 5000]);
    setStockOnly(false);
    setSortBy("newest");
    setQuickFilter("all");
  };

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedRegion !== "all" ? 1 : 0) +
    (searchQuery !== "" ? 1 : 0) +
    (stockOnly ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0) +
    (quickFilter !== "all" ? 1 : 0);

  return (
    <div className="w-full animate-fade-in">
      {/* 1. LUMINOUS EDITORIAL HERO HEADER */}
      <div className="relative w-full bg-gradient-to-b from-[#F9F6F0] via-[#F4EFEA] to-white border-b border-stone-200/70 pt-8 pb-10 md:pt-12 md:pb-14 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[11px] font-semibold tracking-widest uppercase mb-3 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentCategory ? `Univers · ${currentCategory.name}` : "Artisanat d'Exception · Fait Main"}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-3 tracking-tight">
              {currentCategory ? currentCategory.name : "Le Grand Catalogue"}
            </h1>

            <p className="text-stone-600 text-sm md:text-base leading-relaxed mb-5 font-light">
              {currentCategory?.description ||
                "Explorez des créations uniques, sculptées, tissées et façonnées à la main par les maîtres artisans du Maroc."}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <strong className="text-stone-800">{filteredProducts.length}</strong> créations disponibles
              </span>
              <span className="text-stone-300 hidden sm:inline">|</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>6 régions artisanales du Royaume</span>
              </span>
              <span className="text-stone-300 hidden sm:inline">|</span>
              <span className="flex items-center gap-1.5 text-stone-700">
                <Check className="w-3.5 h-3.5 text-primary" />
                <span>Pièces 100% authentiques</span>
              </span>
            </div>

            {/* If the current category has multiple showcase images */}
            {currentCategory && categoryImages.length > 1 && (
              <div className="flex items-center gap-3 bg-white p-2.5 border border-stone-200 shadow-sm w-fit mt-4">
                <span className="text-xs text-stone-600 font-medium flex items-center gap-1.5 pl-1">
                  <Layers className="w-3.5 h-3.5 text-primary" /> Photos d&apos;ambiance ({categoryImages.length}) :
                </span>
                <div className="flex gap-2">
                  {categoryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveCatImgIndex(idx)}
                      className={`relative w-12 h-12 overflow-hidden border-2 transition-all ${
                        activeCatImgIndex === idx
                          ? "border-primary scale-105 shadow-md ring-2 ring-primary/20"
                          : "border-stone-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

      {/* 2. CATEGORIES STORIES CAROUSEL (Instagram/Luxury Boutique Lookbook style) */}
      <div className="mb-8 sm:mb-12 pt-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-stone-500">
            Explorer les univers
          </h2>
          {selectedCategory !== "all" && (
            <button
              onClick={() => {
                setSelectedCategory("all");
                setActiveCatImgIndex(0);
              }}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Afficher tout ({initialProducts.length})
            </button>
          )}
        </div>

        <div className="flex items-start gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 scrollbar-none scroll-smooth">
          {/* "Toutes" Circular Pill */}
          <button
            onClick={() => {
              setSelectedCategory("all");
              setActiveCatImgIndex(0);
            }}
            className="flex flex-col items-center gap-2.5 group shrink-0 focus:outline-none"
          >
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                selectedCategory === "all"
                  ? "border-stone-900 bg-stone-900 text-white shadow-lg ring-4 ring-stone-900/10 ring-offset-2 scale-105"
                  : "border-stone-300 bg-stone-100 text-stone-700 hover:border-stone-500 hover:bg-stone-200"
              }`}
            >
              <Layers className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="text-center">
              <span
                className={`text-xs tracking-wide block whitespace-nowrap transition-colors ${
                  selectedCategory === "all" ? "font-bold text-stone-900" : "font-medium text-stone-600 group-hover:text-stone-900"
                }`}
              >
                Toutes
              </span>
              <span className="text-[10px] text-stone-400 font-light block">
                {initialProducts.length} pièces
              </span>
            </div>
          </button>

          {/* Categories Circular Pills */}
          {categories.map((cat) => {
            const firstImg = cat.images ? cat.images.split("|")[0].trim() : null;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setActiveCatImgIndex(0);
                }}
                className="flex flex-col items-center gap-2.5 group shrink-0 focus:outline-none"
              >
                <div
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                    isSelected
                      ? "border-primary ring-4 ring-primary/20 ring-offset-2 scale-105 shadow-lg"
                      : "border-stone-200 group-hover:border-primary/60 group-hover:scale-105 shadow-sm"
                  }`}
                >
                  {firstImg ? (
                    <Image
                      src={firstImg}
                      alt={cat.name}
                      fill
                      quality={90}
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="80px"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-200" />
                  )}
                </div>
                <div className="text-center">
                  <span
                    className={`text-xs tracking-wide block whitespace-nowrap transition-colors ${
                      isSelected ? "font-bold text-stone-900" : "font-medium text-stone-600 group-hover:text-stone-900"
                    }`}
                  >
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-stone-400 font-light block">
                    {cat.productCount} pièces
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SEARCH & QUICK FILTERS BAR */}
      <div className="bg-white p-4 sm:p-5 border border-stone-200/90 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Instant Search input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par mot-clé, matière, artisan, ville..."
              className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700"
                aria-label="Effacer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort & Quick Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end shrink-0">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-2 px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-700"
            >
              <Filter className="w-3.5 h-3.5 text-primary" />
              <span>Filtres</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort By Dropdown */}
            <div className="flex items-center gap-2 text-xs font-medium text-stone-600 bg-white border border-stone-200 rounded-xl px-3 py-2 shadow-sm">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden sm:inline">Trier par :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-xs font-semibold text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="newest">Nouveautés</option>
                <option value="price-asc">Prix : croissant</option>
                <option value="price-desc">Prix : décroissant</option>
                <option value="rating">Mieux notés</option>
              </select>
            </div>

            {/* Desktop Grid Layout Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-stone-100 rounded-xl border border-stone-200/80 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-stone-900 shadow-sm border border-stone-200"
                    : "text-stone-500 hover:text-stone-900"
                }`}
                title="3 colonnes (Images claires et spacieuses)"
              >
                <div className="flex gap-0.5 w-3.5 h-3">
                  <div className="bg-current flex-1 rounded-[1px]" />
                  <div className="bg-current flex-1 rounded-[1px]" />
                  <div className="bg-current flex-1 rounded-[1px]" />
                </div>
                <span className="text-[11px]">3 col</span>
              </button>
              <button
                onClick={() => setViewMode("compact")}
                className={`px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5 rounded-lg transition-all ${
                  viewMode === "compact"
                    ? "bg-white text-stone-900 shadow-sm border border-stone-200"
                    : "text-stone-500 hover:text-stone-900"
                }`}
                title="4 colonnes (Grille compacte)"
              >
                <div className="flex gap-0.5 w-3.5 h-3">
                  <div className="bg-current flex-1 rounded-[1px]" />
                  <div className="bg-current flex-1 rounded-[1px]" />
                  <div className="bg-current flex-1 rounded-[1px]" />
                  <div className="bg-current flex-1 rounded-[1px]" />
                </div>
                <span className="text-[11px]">4 col</span>
              </button>
              <button
                onClick={() => setViewMode("large")}
                className={`px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5 rounded-lg transition-all ${
                  viewMode === "large"
                    ? "bg-white text-stone-900 shadow-sm border border-stone-200"
                    : "text-stone-500 hover:text-stone-900"
                }`}
                title="Grande vue (2 colonnes)"
              >
                <div className="flex gap-0.5 w-3.5 h-3">
                  <div className="bg-current flex-1 rounded-[1px]" />
                  <div className="bg-current flex-1 rounded-[1px]" />
                </div>
                <span className="text-[11px]">2 col</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filter Pills Row */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-stone-150 scrollbar-none">
          <span className="text-[11px] text-stone-400 font-medium shrink-0 uppercase tracking-wider hidden sm:inline">
            Filtres rapides :
          </span>
          <button
            onClick={() => setQuickFilter((prev) => (prev === "top-rated" ? "all" : "top-rated"))}
            className={`px-3 py-1.5 text-xs rounded-full border whitespace-nowrap transition-all flex items-center gap-1.5 ${
              quickFilter === "top-rated"
                ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                : "bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400 hover:bg-white"
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Coups de cœur (★ 4.8+)</span>
          </button>
          <button
            onClick={() => setQuickFilter((prev) => (prev === "in-stock" ? "all" : "in-stock"))}
            className={`px-3 py-1.5 text-xs rounded-full border whitespace-nowrap transition-all flex items-center gap-1.5 ${
              quickFilter === "in-stock"
                ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                : "bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400 hover:bg-white"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>En stock uniquement</span>
          </button>
          <button
            onClick={() => setQuickFilter((prev) => (prev === "under-500" ? "all" : "under-500"))}
            className={`px-3 py-1.5 text-xs rounded-full border whitespace-nowrap transition-all ${
              quickFilter === "under-500"
                ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                : "bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400 hover:bg-white"
            }`}
          >
            Moins de 500 MAD
          </button>
          <button
            onClick={() => setQuickFilter((prev) => (prev === "under-1000" ? "all" : "under-1000"))}
            className={`px-3 py-1.5 text-xs rounded-full border whitespace-nowrap transition-all ${
              quickFilter === "under-1000"
                ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                : "bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400 hover:bg-white"
            }`}
          >
            Moins de 1 000 MAD
          </button>
          {quickFilter !== "all" && (
            <button
              onClick={() => setQuickFilter("all")}
              className="text-xs text-stone-400 hover:text-stone-700 underline font-medium ml-2 shrink-0"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* 3. MAIN SECTION: SIDEBAR FILTERS + PRODUCT GRID */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* SIDEBAR FILTERS (Desktop) */}
        <aside className="hidden md:block w-72 shrink-0 space-y-6 bg-white p-6 border border-stone-200/90 shadow-sm sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <h3 className="font-serif font-medium text-stone-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-stone-900" /> Filtres
            </h3>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-stone-500 hover:text-stone-950 underline font-medium transition-colors"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {/* Filter: Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">Catégories</h4>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-primary text-white font-semibold shadow-sm"
                    : "text-stone-600 hover:bg-stone-200/60"
                }`}
              >
                <span>Toutes les catégories</span>
                <span className={selectedCategory === "all" ? "text-white/80" : "text-stone-400"}>
                  {initialProducts.length}
                </span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
                    selectedCategory === cat.slug
                      ? "bg-primary text-white font-semibold shadow-sm"
                      : "text-stone-600 hover:bg-stone-200/60"
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className={selectedCategory === cat.slug ? "text-white/80" : "text-stone-400"}>
                    {cat.productCount}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Filter: Regions */}
          <div className="pt-4 border-t border-stone-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" /> Origine & Région
            </h4>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedRegion("all")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedRegion === "all"
                    ? "bg-stone-900 text-white"
                    : "bg-white border border-stone-200 text-stone-600 hover:border-stone-400"
                }`}
              >
                Toutes
              </button>
              {allRegions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    selectedRegion === region
                      ? "bg-stone-900 text-white"
                      : "bg-white border border-stone-200 text-stone-600 hover:border-stone-400"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Filter: Stock Only */}
          <div className="pt-4 border-t border-stone-200">
            <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-stone-700 font-medium">
              <input
                type="checkbox"
                checked={stockOnly}
                onChange={(e) => setStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary accent-primary"
              />
              <span>En stock uniquement</span>
            </label>
          </div>

          {/* Filter: Price Range */}
          <div className="pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Prix maximum</h4>
              <span className="text-xs font-bold text-primary">{priceRange[1]} MAD</span>
            </div>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value, 10)])}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>0 MAD</span>
              <span>5 000+ MAD</span>
            </div>
          </div>
        </aside>

        {/* PRODUCTS AREA */}
        <div className="flex-1 w-full">
          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-stone-100/80 border border-stone-200/80">
              <span className="text-xs text-stone-500 font-medium">Filtres actifs :</span>
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 text-xs font-medium text-stone-800">
                  Catégorie: {categories.find((c) => c.slug === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory("all")}>
                    <X className="w-3 h-3 text-stone-400 hover:text-stone-700" />
                  </button>
                </span>
              )}
              {selectedRegion !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 text-xs font-medium text-stone-800">
                  Région: {selectedRegion}
                  <button onClick={() => setSelectedRegion("all")}>
                    <X className="w-3 h-3 text-stone-400 hover:text-stone-700" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 text-xs font-medium text-stone-800">
                  Recherche: &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery("")}>
                    <X className="w-3 h-3 text-stone-400 hover:text-stone-700" />
                  </button>
                </span>
              )}
              {stockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 text-xs font-medium text-stone-800">
                  En stock
                  <button onClick={() => setStockOnly(false)}>
                    <X className="w-3 h-3 text-stone-400 hover:text-stone-700" />
                  </button>
                </span>
              )}
              {priceRange[1] < 5000 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 text-xs font-medium text-stone-800">
                  Max: {priceRange[1]} MAD
                  <button onClick={() => setPriceRange([0, 5000])}>
                    <X className="w-3 h-3 text-stone-400 hover:text-stone-700" />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-primary hover:underline font-semibold ml-auto"
              >
                Tout effacer
              </button>
            </div>
          )}

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-medium text-stone-500">
              <span className="font-bold text-stone-900">{filteredProducts.length}</span> pièce(s) trouvée(s)
            </p>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div
              className={`grid ${
                viewMode === "grid"
                  ? "grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                  : viewMode === "compact"
                  ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5"
                  : "grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8"
              }`}
            >
              {filteredProducts.map((product) => {
                const imgInfo = getProductImage(product.id, product.images);
                const allImgs = product.images.split("|").map((s) => s.trim()).filter(Boolean);
                const hoverImg = allImgs[1] && allImgs[1] !== imgInfo.currentUrl ? allImgs[1] : null;

                return (
                  <div
                    key={product.id}
                    className="group relative bg-white rounded-2xl border border-stone-200/80 overflow-hidden hover:shadow-2xl hover:-translate-y-1 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Media Container with Multi-image carousel buttons & Hover Swap */}
                    <div className="relative aspect-[4/5] bg-stone-50 overflow-hidden">
                      <Link href={`/produit/${product.slug}`} className="block w-full h-full relative">
                        {/* Primary Image */}
                        <Image
                          src={imgInfo.currentUrl}
                          alt={product.name}
                          fill
                          quality={90}
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                          className={`object-cover transition-all duration-700 ease-out ${
                            hoverImg
                              ? "group-hover:opacity-0 group-hover:scale-105"
                              : "group-hover:scale-105"
                          }`}
                        />
                        {/* Hover Lifestyle Image (if available) */}
                        {hoverImg && (
                          <Image
                            src={hoverImg}
                            alt={`${product.name} vue d'ambiance`}
                            fill
                            quality={90}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                          />
                        )}
                      </Link>

                      {/* Stock badge */}
                      <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 z-10 pointer-events-none">
                        {product.inStock ? (
                          <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold bg-white/95 backdrop-blur-md text-emerald-800 shadow-sm border border-emerald-100 flex items-center gap-1.5 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="hidden sm:inline">En stock</span>
                            <span className="sm:hidden">Dispo</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold bg-rose-50 text-rose-700 shadow-sm border border-rose-200 uppercase tracking-wider">
                            Rupture
                          </span>
                        )}
                      </div>

                      {/* Top Right Actions (Wishlist + Mobile Quick View) */}
                      <div className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 z-10 flex flex-col gap-1.5">
                        <button
                          className="p-1.5 sm:p-2 bg-white/95 backdrop-blur-md text-stone-500 hover:text-red-500 hover:bg-white shadow-sm transition-all rounded-full"
                          aria-label="Ajouter aux favoris"
                        >
                          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 hover:fill-red-500" />
                        </button>
                      </div>

                      {/* Desktop Quick View Slide-up Bar */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setQuickViewProduct(product);
                          setQuickViewImgIdx(0);
                        }}
                        className="hidden sm:flex absolute inset-x-3 bottom-3 py-2.5 px-4 bg-white/95 backdrop-blur-md text-stone-900 text-xs font-semibold shadow-lg items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 hover:bg-stone-900 hover:text-white z-10"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Aperçu rapide</span>
                      </button>

                      {/* Mobile Quick View Floating Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setQuickViewProduct(product);
                          setQuickViewImgIdx(0);
                        }}
                        className="sm:hidden absolute bottom-2 right-2 p-1.5 bg-white/95 backdrop-blur-md text-stone-700 hover:text-stone-900 shadow-sm z-10 flex items-center justify-center rounded-full"
                        aria-label="Aperçu rapide"
                      >
                        <Eye className="w-3.5 h-3.5 text-stone-800" />
                      </button>

                      {/* Image dots / next & prev if multiple pictures */}
                      {imgInfo.totalCount > 1 && (
                        <>
                          <div className="hidden sm:flex absolute inset-y-0 left-1 right-1 items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <button
                              type="button"
                              onClick={(e) => handlePrevProductImage(e, product.id, imgInfo.totalCount)}
                              className="pointer-events-auto p-1.5 bg-black/50 text-white hover:bg-black/80 backdrop-blur-sm transition-all"
                              aria-label="Photo précédente"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleNextProductImage(e, product.id, imgInfo.totalCount)}
                              className="pointer-events-auto p-1.5 bg-black/50 text-white hover:bg-black/80 backdrop-blur-sm transition-all"
                              aria-label="Photo suivante"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1 z-10 pointer-events-none sm:group-hover:hidden">
                            {Array.from({ length: Math.min(imgInfo.totalCount, 5) }).map((_, dotIdx) => (
                              <span
                                key={dotIdx}
                                className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-all ${
                                  dotIdx === imgInfo.currentIndex
                                    ? "bg-white w-2.5 sm:w-3 shadow-md"
                                    : "bg-white/50"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between bg-white">
                      <div>
                        <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                          <span className="font-semibold text-primary uppercase tracking-wider text-[10px] sm:text-[11px] truncate">
                            {product.category.name}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] sm:text-xs text-stone-500 shrink-0 font-medium">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            <span>{product.artisan.region}</span>
                          </span>
                        </div>

                        <Link
                          href={`/produit/${product.slug}`}
                          className="font-serif font-bold text-stone-900 text-sm sm:text-base lg:text-lg hover:text-primary transition-colors line-clamp-1 mb-1 block leading-snug"
                        >
                          {product.name}
                        </Link>

                        <p className="text-xs text-stone-500 mb-2 truncate font-normal">
                          Par <span className="font-medium text-stone-700">{product.artisan.name}</span>
                          {product.material && <span className="hidden sm:inline"> · {product.material}</span>}
                        </p>

                        <div className="flex items-center gap-1.5 mb-3">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                                  i < Math.round(product.rating)
                                    ? "fill-accent text-accent"
                                    : "text-stone-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-stone-700 font-semibold">{product.rating.toFixed(1)}</span>
                          <span className="text-[11px] text-stone-400 font-normal">({product.reviewCount})</span>
                        </div>
                      </div>

                      {/* Bottom Price + CTA */}
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between mt-auto gap-2">
                        <div className="shrink-0">
                          <FormattedPrice amount={product.price} className="text-base sm:text-lg lg:text-xl font-bold text-stone-900 block whitespace-nowrap" />
                          {product.oldPrice && (
                            <FormattedPrice
                              amount={product.oldPrice}
                              className="text-[10px] sm:text-xs text-stone-400 line-through block whitespace-nowrap"
                            />
                          )}
                        </div>

                        <Link
                          href={`/produit/${product.slug}`}
                          className="inline-flex items-center gap-1 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-stone-900 text-white text-xs font-semibold hover:bg-primary rounded-xl transition-all shadow-sm shrink-0"
                        >
                          <span className="hidden sm:inline">Voir détails</span>
                          <span className="sm:hidden">Voir</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20 bg-sand-light rounded-2xl border border-stone-200/80 p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-200/60 flex items-center justify-center text-stone-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
                Aucune création trouvée
              </h3>
              <p className="text-sm text-stone-500 max-w-md mx-auto mb-6">
                Aucun produit ne correspond à vos filtres actuels. Essayez de réinitialiser vos critères ou d&apos;élargir votre recherche.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors shadow-md"
              >
                Réinitialiser tous les filtres
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE DRAWER FILTERS */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-sand-light h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
                <h3 className="font-serif font-bold text-stone-900 text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" /> Filtres
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-md text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Catégorie</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs ${
                      selectedCategory === "all" ? "bg-primary text-white font-bold" : "text-stone-700"
                    }`}
                  >
                    <span>Toutes</span>
                    <span>{initialProducts.length}</span>
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs ${
                        selectedCategory === c.slug ? "bg-primary text-white font-bold" : "text-stone-700"
                      }`}
                    >
                      <span>{c.name}</span>
                      <span>{c.productCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Regions */}
              <div className="mb-6 pt-4 border-t border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Régions</h4>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedRegion("all")}
                    className={`px-2.5 py-1 rounded text-xs ${
                      selectedRegion === "all" ? "bg-stone-900 text-white" : "bg-white text-stone-700"
                    }`}
                  >
                    Toutes
                  </button>
                  {allRegions.map((r) => (
                    <button
                      key={r}
                      onClick={() => setSelectedRegion(r)}
                      className={`px-2.5 py-1 rounded text-xs ${
                        selectedRegion === r ? "bg-stone-900 text-white" : "bg-white text-stone-700"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock */}
              <div className="mb-6 pt-4 border-t border-stone-200">
                <label className="flex items-center gap-2 text-xs font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={stockOnly}
                    onChange={(e) => setStockOnly(e.target.checked)}
                    className="accent-primary"
                  />
                  <span>En stock uniquement</span>
                </label>
              </div>

              {/* Price */}
              <div className="mb-6 pt-4 border-t border-stone-200">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>Prix max</span>
                  <span className="text-primary">{priceRange[1]} MAD</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value, 10)])}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-lg bg-stone-900 text-white text-xs font-semibold"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK VIEW MODAL */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-white shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-3 right-3 z-30 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 shadow-md transition-all"
              aria-label="Fermer l'aperçu"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left: Product Images Gallery */}
            <div className="md:w-1/2 bg-stone-100 flex flex-col shrink-0">
              {(() => {
                const modalImgs = quickViewProduct.images
                  .split("|")
                  .map((s) => s.trim())
                  .filter(Boolean);
                const currentImg = modalImgs[quickViewImgIdx] || modalImgs[0] || "/placeholder.jpg";

                return (
                  <>
                    <div className="relative aspect-[4/5] sm:aspect-square md:aspect-[4/5] w-full bg-stone-100 overflow-hidden">
                      <Image
                        src={currentImg}
                        alt={quickViewProduct.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        priority
                      />
                      {quickViewProduct.inStock && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-2.5 py-1 text-[10px] font-bold bg-white/95 backdrop-blur-sm text-emerald-800 shadow-sm border border-emerald-100 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            En stock
                          </span>
                        </div>
                      )}
                    </div>

                    {modalImgs.length > 1 && (
                      <div className="flex gap-2 p-2.5 overflow-x-auto bg-stone-50 border-t border-stone-200/80">
                        {modalImgs.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setQuickViewImgIdx(idx)}
                            className={`relative w-12 h-12 shrink-0 overflow-hidden border-2 transition-all ${
                              idx === quickViewImgIdx
                                ? "border-primary shadow-sm"
                                : "border-stone-200 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <Image
                              src={img}
                              alt=""
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Right: Product Details & Actions */}
            <div className="md:w-1/2 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[92vh]">
              <div>
                {/* Category & Region */}
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="font-semibold text-primary uppercase tracking-wider text-[11px]">
                    {quickViewProduct.category.name}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-stone-500">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    {quickViewProduct.artisan.region}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 mb-1 leading-tight">
                  {quickViewProduct.name}
                </h3>

                {/* Artisan credit */}
                <p className="text-xs text-stone-500 mb-3">
                  Façonné à la main par{" "}
                  <span className="font-semibold text-stone-800">
                    {quickViewProduct.artisan.name}
                  </span>
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.round(quickViewProduct.rating)
                            ? "fill-accent text-accent"
                            : "text-stone-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-stone-700">
                    {quickViewProduct.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-stone-400">
                    ({quickViewProduct.reviewCount} avis vérifiés)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2.5 mb-4 pb-4 border-b border-stone-100">
                  <FormattedPrice
                    amount={quickViewProduct.price}
                    className="text-2xl font-bold text-stone-900"
                  />
                  {quickViewProduct.oldPrice && (
                    <FormattedPrice
                      amount={quickViewProduct.oldPrice}
                      className="text-sm text-stone-400 line-through"
                    />
                  )}
                </div>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-stone-600 mb-5 leading-relaxed line-clamp-3">
                  {quickViewProduct.description}
                </p>

                {/* Specs Pills */}
                <div className="grid grid-cols-2 gap-2 mb-6 text-xs bg-sand-light/60 p-3 rounded-lg border border-stone-200/60">
                  {quickViewProduct.material && (
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Matière</span>
                      <span className="text-stone-800 font-medium">{quickViewProduct.material}</span>
                    </div>
                  )}
                  {quickViewProduct.dimensions && (
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Dimensions</span>
                      <span className="text-stone-800 font-medium">{quickViewProduct.dimensions}</span>
                    </div>
                  )}
                  {quickViewProduct.technique && (
                    <div className="col-span-2">
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Technique</span>
                      <span className="text-stone-800 font-medium">{quickViewProduct.technique}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-3 border-t border-stone-100">
                <a
                  href={`https://wa.me/212600000000?text=${encodeURIComponent(
                    `Bonjour, je souhaite commander la création artisanale : ${quickViewProduct.name} (${quickViewProduct.price} MAD).\nLien: http://localhost:3000/produit/${quickViewProduct.slug}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Commander via WhatsApp</span>
                </a>

                <Link
                  href={`/produit/${quickViewProduct.slug}`}
                  onClick={() => setQuickViewProduct(null)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-900 hover:bg-primary text-white font-semibold text-xs sm:text-sm transition-colors"
                >
                  <span>Voir la fiche détaillée</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
