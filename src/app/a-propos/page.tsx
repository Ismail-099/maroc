import Image from "next/image";
import { Heart, ShieldCheck, Truck, Users } from "lucide-react";
import { getSiteImage } from "@/lib/siteImages";

export default async function AboutPage() {
  const aboutImage = await getSiteImage("image-apropos", "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800");
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-3">A propos d&apos;Artisanat Maroc</h1>
        <p className="text-stone-600 max-w-2xl mx-auto">
          Nous mettons en valeur les artisans marocains et leurs creations uniques depuis plus de 15 ans.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="relative h-[400px] overflow-hidden">
          <Image src={aboutImage} alt="Artisan" fill className="object-cover" />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">Notre mission</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Artisanat Maroc est ne d&apos;une passion profonde pour le savoir-faire traditionnel marocain. 
            Notre mission est simple : connecter les artisans locaux avec le monde entier, 
            tout en garantissant un commerce equitable et transparent.
          </p>
          <p className="text-stone-600 leading-relaxed">
            Chaque piece que vous trouvez sur notre plateforme est authentique, faite a la main 
            et porte en elle l&apos;histoire de son createur. Nous croyons que l&apos;artisanat n&apos;est pas 
            seulement un objet, mais un lien entre les cultures et les generations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <div className="bg-sand-light border border-stone-200 p-6 text-center">
          <Heart className="w-8 h-8 mx-auto mb-3 text-primary" />
          <p className="text-2xl font-bold text-stone-900">100%</p>
          <p className="text-sm text-stone-500">Artisanal</p>
        </div>
        <div className="bg-sand-light border border-stone-200 p-6 text-center">
          <ShieldCheck className="w-8 h-8 mx-auto mb-3 text-primary" />
          <p className="text-2xl font-bold text-stone-900">Authentique</p>
          <p className="text-sm text-stone-500">Certifie</p>
        </div>
        <div className="bg-sand-light border border-stone-200 p-6 text-center">
          <Truck className="w-8 h-8 mx-auto mb-3 text-primary" />
          <p className="text-2xl font-bold text-stone-900">Monde</p>
          <p className="text-sm text-stone-500">Livraison internationale</p>
        </div>
        <div className="bg-sand-light border border-stone-200 p-6 text-center">
          <Users className="w-8 h-8 mx-auto mb-3 text-primary" />
          <p className="text-2xl font-bold text-stone-900">+50</p>
          <p className="text-sm text-stone-500">Artisans</p>
        </div>
      </div>
    </div>
  );
}
