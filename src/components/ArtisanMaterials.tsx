import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Leaf, Compass, Feather } from "lucide-react";
import { getSiteImageDetails } from "@/lib/siteImages";

interface MaterialItem {
  id: string;
  name: string;
  badge: string;
  origin: string;
  description: string;
  craftSecret: string;
  image: string;
  alt: string;
  categorySlug: string;
  categoryName: string;
  icon: typeof Leaf;
}

const defaultMaterials: MaterialItem[] = [
  {
    id: "laine",
    name: "La Laine Vierge de l'Atlas",
    badge: "100% Vierge & Non Traitée",
    origin: "Moyen & Haut Atlas",
    description:
      "Tondue sur les brebis des hauts plateaux, lavée à l'eau de source glacée et séchée au soleil, cette laine préserve toute sa lanoline naturelle pour une douceur et une résistance inégalées.",
    craftSecret: "Filée au fuseau manuel et tissée brin par brin par les femmes des tribus berbères.",
    image: "https://images.unsplash.com/photo-1767390552768-6703f91c2518?w=800",
    alt: "Tissage de laine vierge sur métier traditionnel marocain",
    categorySlug: "textiles-tapis",
    categoryName: "Tapis & Textiles",
    icon: Feather,
  },
  {
    id: "argile",
    name: "L'Argile Pure de Safi & du Rif",
    badge: "Minérale & Respirante",
    origin: "Safi, Zagora & Région du Rif",
    description:
      "Une terre riche en minéraux, prélevée dans les vallées ocreuses, décantée dans des bassins d'eau claire avant d'être longuement malaxée à la main pour acquérir sa texture soyeuse.",
    craftSecret: "Façonnée au tour à pied, peinte aux oxydes minéraux purs et cuite au feu de bois.",
    image: "https://plus.unsplash.com/premium_photo-1663040237172-c8974380a5d6?w=800",
    alt: "Artisan potier modelant l'argile sur un tour de potier",
    categorySlug: "poterie-ceramique",
    categoryName: "Poterie & Céramique",
    icon: Sparkles,
  },
  {
    id: "bois",
    name: "Le Cèdre & la Loupe de Thuya",
    badge: "Essences Sauvages Durables",
    origin: "Forêts d'Ifrane & Région d'Essaouira",
    description:
      "Des essences de bois réputées pour leur grain dense, leurs marbrures naturelles et leur parfum boisé apaisant qui imprègne durablement chaque pièce de vie.",
    craftSecret: "Sculpté à la gouge et incrusté à la main de nacre, d'ébène et de bois de citronnier.",
    image: "https://images.unsplash.com/photo-1759523146335-0069847ceb16?w=800",
    alt: "Sculpture manuelle sur bois de cèdre noble",
    categorySlug: "bois-sculpture",
    categoryName: "Bois & Sculpture",
    icon: Compass,
  },
  {
    id: "cuir",
    name: "Le Cuir au Tannage Végétal",
    badge: "Zéro Chimique & Écologique",
    origin: "Tanneries millénaires de Fès",
    description:
      "Hérité du XIe siècle, le tannage traditionnel marocain utilise exclusivement des éléments de la nature : écorces de grenadier, son de blé, safran et huiles végétales pures.",
    craftSecret: "Une matière vivante qui s'assouplit et gagne une patine unique avec les années.",
    image: "https://images.unsplash.com/photo-1745837893977-34f76b11f644?w=800",
    alt: "Tannerie traditionnelle à ciel ouvert de Fès",
    categorySlug: "cuir-maroquinerie",
    categoryName: "Cuir & Maroquinerie",
    icon: Leaf,
  },
];

export default async function ArtisanMaterials() {
  const [laine, argile, bois, cuir] = await Promise.all([
    getSiteImageDetails("material-laine", defaultMaterials[0].image, defaultMaterials[0].craftSecret),
    getSiteImageDetails("material-argile", defaultMaterials[1].image, defaultMaterials[1].craftSecret),
    getSiteImageDetails("material-bois", defaultMaterials[2].image, defaultMaterials[2].craftSecret),
    getSiteImageDetails("material-cuir", defaultMaterials[3].image, defaultMaterials[3].craftSecret),
  ]);

  const materials = [
    { ...defaultMaterials[0], image: laine.src, craftSecret: laine.description || defaultMaterials[0].craftSecret },
    { ...defaultMaterials[1], image: argile.src, craftSecret: argile.description || defaultMaterials[1].craftSecret },
    { ...defaultMaterials[2], image: bois.src, craftSecret: bois.description || defaultMaterials[2].craftSecret },
    { ...defaultMaterials[3], image: cuir.src, craftSecret: cuir.description || defaultMaterials[3].craftSecret },
  ];

  return (
    <section className="py-14 sm:py-20 md:py-24 bg-[#FAF8F5] border-y border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold block mb-2 sm:mb-3">
            L&apos;Âme du Savoir-Faire
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif font-medium text-stone-900 mb-4 md:mb-6 leading-tight">
            Des matières vivantes façonnées par le temps
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm md:text-base font-light leading-relaxed px-2 sm:px-0">
            L&apos;artisanat marocain puise sa noblesse dans une symbiose absolue avec la terre. 
            Ici, aucune matière synthétique : chaque création naît d&apos;éléments bruts 100% naturels, 
            extraits avec respect et transformés sans chimie industrielle.
          </p>
        </div>

        {/* 4 Materials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 sm:mb-16">
          {materials.map((mat) => {
            const Icon = mat.icon;
            return (
              <div
                key={mat.id}
                className="bg-white border border-stone-200/80 flex flex-col justify-between overflow-hidden group hover:border-stone-900 transition-colors duration-500 shadow-sm"
              >
                <div>
                  {/* Photo with subtle zoom */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                    <Image
                      src={mat.image}
                      alt={mat.alt}
                      fill
                      className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-transparent transition-colors duration-500" />
                    
                    {/* Badge */}
                    <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-white/95 backdrop-blur-sm text-stone-900 text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 border border-stone-200/50">
                      {mat.badge}
                    </span>
                  </div>

                  {/* Text Details */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-stone-400 font-medium uppercase tracking-wider mb-1.5 sm:mb-2">
                      <Icon className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                      <span>{mat.origin}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-serif font-medium text-stone-900 mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                      {mat.name}
                    </h3>

                    <p className="text-stone-600 text-xs leading-relaxed font-light mb-3 sm:mb-4">
                      {mat.description}
                    </p>

                    <div className="p-3 bg-stone-50 border-l-2 border-stone-800 text-[11px] text-stone-700 leading-relaxed font-serif italic mb-2 sm:mb-4">
                      &ldquo;{mat.craftSecret}&rdquo;
                    </div>
                  </div>
                </div>

                {/* Footer link to category */}
                <div className="p-5 sm:p-6 pt-0">
                  <Link
                    href={`/catalogue?category=${mat.categorySlug}`}
                    className="inline-flex items-center justify-between w-full text-xs uppercase tracking-wider font-semibold text-stone-900 py-2.5 border-t border-stone-150 hover:text-stone-600 transition-colors group/link"
                  >
                    <span>Voir les pièces en {mat.categoryName}</span>
                    <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform shrink-0" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Philosophy Banner */}
        <div className="bg-stone-900 text-white p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-semibold block mb-2">
              Philosophie Ancestrale
            </span>
            <h4 className="text-lg sm:text-xl md:text-2xl font-serif font-normal text-stone-100 mb-2 leading-snug">
              L&apos;anti fast-décor : des objets faits pour traverser les générations
            </h4>
            <p className="text-xs md:text-sm text-stone-400 font-light leading-relaxed">
              Contrairement aux meubles et objets industriels éphémères, les matières naturelles marocaines 
              ne s&apos;usent pas : elles se patinent avec grâce et s&apos;embellissent avec le temps.
            </p>
          </div>

          <Link
            href="/catalogue"
            className="w-full md:w-auto text-center shrink-0 bg-white text-stone-950 px-8 py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-stone-100 transition-colors"
          >
            Découvrir le catalogue
          </Link>
        </div>
      </div>
    </section>
  );
}
