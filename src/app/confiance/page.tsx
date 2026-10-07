import Image from "next/image";
import { Star, Users, Award, Globe } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getTrustData() {
  const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } });
  const testimonials = await prisma.testimonial.findMany();
  return { partners, testimonials };
}

export default async function ConfiancePage() {
  const { partners, testimonials } = await getTrustData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-3">Ils nous font confiance</h1>
        <p className="text-stone-600 max-w-2xl mx-auto">
          Des entreprises et institutions qui choisissent l&apos;artisanat marocain.
        </p>
      </div>

      {/* Partners */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 mb-16">
        {partners.map((partner) => (
          <div key={partner.id} className="flex items-center justify-center h-20 bg-sand border border-stone-200">
            <span className="text-lg font-serif font-bold text-stone-400">{partner.logo}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <div className="bg-stone-900 text-white p-6 text-center">
          <Users className="w-8 h-8 mx-auto mb-3 text-accent" />
          <p className="text-3xl font-bold">+500</p>
          <p className="text-sm text-stone-400">clients satisfaits</p>
        </div>
        <div className="bg-stone-900 text-white p-6 text-center">
          <Award className="w-8 h-8 mx-auto mb-3 text-accent" />
          <p className="text-3xl font-bold">+50</p>
          <p className="text-sm text-stone-400">artisans partenaires</p>
        </div>
        <div className="bg-stone-900 text-white p-6 text-center">
          <Globe className="w-8 h-8 mx-auto mb-3 text-accent" />
          <p className="text-3xl font-bold">+15</p>
          <p className="text-sm text-stone-400">annees d&apos;experience</p>
        </div>
        <div className="bg-stone-900 text-white p-6 text-center">
          <Star className="w-8 h-8 mx-auto mb-3 text-accent" />
          <p className="text-3xl font-bold">4.8</p>
          <p className="text-sm text-stone-400">note moyenne</p>
        </div>
      </div>

      {/* Testimonials */}
      <h2 className="text-2xl font-serif font-bold text-stone-900 mb-8 text-center">Temoignages</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-sand-light border border-stone-200 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-14 h-14 overflow-hidden bg-stone-200">
                {t.image && <Image src={t.image} alt={t.name} fill className="object-cover" />}
              </div>
              <div>
                <p className="font-medium text-stone-900">{t.name}</p>
                <p className="text-sm text-stone-500">{t.role}</p>
              </div>
            </div>
            <p className="text-stone-600 italic">&ldquo;{t.content}&rdquo;</p>
          </div>
        ))}
      </div>
    </div>
  );
}
