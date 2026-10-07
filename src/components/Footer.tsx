import Link from "next/link";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-serif text-lg mb-4">Artisanat Maroc</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              L'authenticite du savoir-faire marocain. Des artisans passionnes, des creations uniques.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalogue" className="hover:text-white transition-colors">Catalogue</Link></li>
              <li><Link href="/magazine" className="hover:text-white transition-colors">Magazine</Link></li>
              <li><Link href="/artisans" className="hover:text-white transition-colors">Artisans</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Service client</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Livraison</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Retours</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Mentions legales</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Newsletter</h4>
            <p className="text-sm text-stone-400 mb-3">Recevez nos inspirations et nouveautes.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 bg-stone-800 border border-stone-700 px-3 py-2 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-primary"
              />
              <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 text-sm transition-colors">
                S'inscrire
              </button>
            </div>
            <div className="flex gap-4 mt-6">
              <Instagram className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              <Facebook className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              <Youtube className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-8 text-center text-sm text-stone-500">
          &copy; 2024 Artisanat Maroc. Tous droits reserves.
        </div>
      </div>
    </footer>
  );
}
