import Image from "next/image";
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { getSiteImage } from "@/lib/siteImages";

export default async function ContactPage() {
  const banner = await getSiteImage("banner-contact", "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="relative h-[300px] overflow-hidden mb-10">
        <Image
          src={banner}
          alt="Contactez-nous"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">Contactez-nous</h1>
          <p className="text-stone-200 text-sm md:text-base max-w-xl">
            Une question ? Un projet ? Nous sommes la pour vous.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact info */}
        <div>
          <h2 className="text-xl font-bold text-stone-900 mb-6">Nos coordonnees</h2>
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-stone-600">
              <Phone className="w-5 h-5 text-primary" />
              <span>+212 5 24 43 78 90</span>
            </div>
            <div className="flex items-center gap-3 text-stone-600">
              <Mail className="w-5 h-5 text-primary" />
              <span>contact@artisanatmaroc.ma</span>
            </div>
            <div className="flex items-center gap-3 text-stone-600">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Marrakech, Maroc</span>
            </div>
          </div>

          <a
            href="https://wa.me/212524437890?text=Bonjour Artisanat Maroc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 font-medium hover:bg-green-700 transition-colors mb-8"
          >
            <MessageCircle className="w-5 h-5" /> WhatsApp
          </a>

          <div className="flex gap-4">
            <Instagram className="w-5 h-5 text-stone-600 hover:text-primary cursor-pointer transition-colors" />
            <Facebook className="w-5 h-5 text-stone-600 hover:text-primary cursor-pointer transition-colors" />
            <Twitter className="w-5 h-5 text-stone-600 hover:text-primary cursor-pointer transition-colors" />
            <Youtube className="w-5 h-5 text-stone-600 hover:text-primary cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Form */}
        <div className="bg-sand-light border border-stone-200 p-6">
          <h2 className="text-xl font-bold text-stone-900 mb-6">Envoyez-nous un message</h2>
          <form className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Nom</label>
                <input type="text" className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Sujet</label>
              <input type="text" className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Message</label>
              <textarea rows={4} className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:border-primary" />
            </div>
            <button type="submit" className="w-full bg-stone-900 text-white py-3 font-medium hover:bg-stone-800 transition-colors">
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
