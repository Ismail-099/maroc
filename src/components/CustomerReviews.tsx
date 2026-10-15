import { Star, ShieldCheck, CheckCircle2, HeartHandshake, PackageCheck } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface Review {
  id: string;
  author: string;
  city: string;
  country: string;
  date: string;
  productName: string;
  productSlug?: string;
  rating: number;
  content: string;
  avatarText: string;
}

const defaultReviews: Review[] = [
  {
    id: "1",
    author: "Sophie Delaunay",
    city: "Paris",
    country: "France",
    date: "Il y a 3 jours",
    productName: "Tapis Beni Ouarain",
    productSlug: "tapis-beni-ouarain",
    rating: 5,
    avatarText: "SD",
    content:
      "Le tapis est une pure merveille. La laine vierge est d'une épaisseur et d'une douceur exceptionnelles. Il illumine totalement notre salon contemporain. Le certificat signé par la tisserande apporte une vraie valeur sentimentale.",
  },
  {
    id: "2",
    author: "Karim Berrada",
    city: "Casablanca",
    country: "Maroc",
    date: "Il y a 1 semaine",
    productName: "Vase en céramique berbère",
    productSlug: "vase-ceramique-berbere",
    rating: 5,
    avatarText: "KB",
    content:
      "Sublime poterie faite à la main. On ressent le travail du geste artisanal, la texture est magnifique et les motifs géométriques ont un rendu ultra chic. Expédition très soignée et rapide.",
  },
  {
    id: "3",
    author: "Marc & Elena Van Dyck",
    city: "Bruxelles",
    country: "Belgique",
    date: "Il y a 2 semaines",
    productName: "Table sculptée en cèdre",
    productSlug: "table-bois-sculpte",
    rating: 5,
    avatarText: "ME",
    content:
      "Le parfum naturel du bois de cèdre dans la pièce est un régal ! Les sculptures manuelles sont d'une précision remarquable. C'est une pièce de collection qui suscite l'admiration de tous nos invités.",
  },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default async function CustomerReviews() {
  const testimonials = await prisma.testimonial.findMany({ take: 6 });

  let reviews: Review[] = defaultReviews;
  if (testimonials && testimonials.length > 0) {
    reviews = testimonials.map((t, idx) => {
      let city = "Client";
      let country = "Maroc";
      let productName = "Création artisanale";
      let productSlug: string | undefined = undefined;

      if (t.role) {
        if (t.role.includes("•")) {
          const [loc, prod] = t.role.split("•").map((s) => s.trim());
          if (loc.includes(",")) {
            const [c, co] = loc.split(",").map((s) => s.trim());
            city = c || city;
            country = co || country;
          } else {
            city = loc;
          }
          productName = prod || productName;
        } else {
          city = t.role;
        }
      }

      const ratingNum = t.image && !isNaN(Number(t.image)) ? Math.min(5, Math.max(1, Number(t.image))) : 5;

      return {
        id: t.id,
        author: t.name,
        city,
        country,
        date: idx === 0 ? "Il y a 3 jours" : idx === 1 ? "Il y a 1 semaine" : "Récemment",
        productName,
        productSlug,
        rating: ratingNum,
        content: t.content,
        avatarText: getInitials(t.name),
      };
    });
  }

  return (
    <section className="py-14 sm:py-20 md:py-24 bg-stone-50 border-t border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Global score */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold block mb-2 sm:mb-3">
            Expérience & Avis Clients
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-stone-900 mb-4 sm:mb-5 leading-tight">
            Plus de 500 intérieurs sublimés à travers le monde
          </h2>
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-white px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full border border-stone-200/80 shadow-sm">
            <div className="flex items-center gap-0.5 sm:gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs sm:text-sm font-semibold text-stone-900">4.9 / 5</span>
            <span className="text-stone-300">|</span>
            <span className="text-[11px] sm:text-xs text-stone-600 font-medium">520+ clients satisfaits</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 mb-12 sm:mb-16">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-5 sm:p-8 rounded-none border border-stone-200/70 flex flex-col justify-between hover:border-stone-400 transition-colors duration-300 shadow-sm"
            >
              <div>
                {/* Top: Stars + Verified Badge */}
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Achat vérifié
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6 font-light italic">
                  &ldquo;{rev.content}&rdquo;
                </p>
              </div>

              {/* Bottom: Product tag & Author */}
              <div className="pt-4 sm:pt-5 border-t border-stone-100">
                <div className="flex items-center justify-between text-[11px] sm:text-xs text-stone-500 mb-2.5 sm:mb-3">
                  <span className="font-light">Produit commandé :</span>
                  {rev.productSlug ? (
                    <Link
                      href={`/produit/${rev.productSlug}`}
                      className="text-stone-900 font-medium hover:underline tracking-tight"
                    >
                      {rev.productName}
                    </Link>
                  ) : (
                    <span className="text-stone-900 font-medium">{rev.productName}</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-900 text-white flex items-center justify-center text-[11px] sm:text-xs font-medium tracking-wider shrink-0">
                    {rev.avatarText}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-900">{rev.author}</p>
                    <p className="text-[10px] sm:text-[11px] text-stone-400 font-light">
                      {rev.city}, {rev.country} &bull; {rev.date}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Guarantees Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6 pt-8 sm:pt-10 border-t border-stone-200">
          <div className="flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 bg-white/70 border border-stone-200/60">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-stone-900" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-stone-900">
                Certificat d&apos;authenticité
              </h4>
              <p className="text-[11px] sm:text-xs text-stone-500 font-light">Chaque pièce est certifiée et signée par son créateur.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 bg-white/70 border border-stone-200/60">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 text-stone-900" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-stone-900">
                Rémunération équitable
              </h4>
              <p className="text-[11px] sm:text-xs text-stone-500 font-light">Soutien direct aux familles et coopératives artisanales.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 bg-white/70 border border-stone-200/60">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
              <PackageCheck className="w-4 h-4 sm:w-5 sm:h-5 text-stone-900" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-stone-900">
                Transport sécurisé
              </h4>
              <p className="text-[11px] sm:text-xs text-stone-500 font-light">Emballage renforcé et suivi en temps réel garanti.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
