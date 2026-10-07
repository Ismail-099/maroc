import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSiteImage } from "@/lib/siteImages";

async function getStories() {
  return prisma.story.findMany({
    include: { artisan: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function MagazinePage() {
  const stories = await getStories();
  const banner = await getSiteImage("banner-magazine", "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200");
  const featured = stories[0];
  const rest = stories.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="relative h-[300px] overflow-hidden mb-10">
        <Image
          src={banner}
          alt="Le magazine"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">Le magazine</h1>
          <p className="text-stone-200 text-sm md:text-base max-w-xl">
            Histoires, traditions et inspirations du Maroc artisanal.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-10">
        {["Tous", "Artisanat", "Artisans", "Culture", "Voyages"].map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              cat === "Tous" ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured */}
      {featured && (
        <div className="grid md:grid-cols-2 gap-8 mb-12 bg-sand-light border border-stone-200 overflow-hidden">
          <div className="relative h-[300px] md:h-auto">
            <Image src={featured.image} alt={featured.title} fill className="object-cover" />
          </div>
          <div className="p-8 flex flex-col justify-center">
            <span className="text-xs font-medium text-primary uppercase tracking-wider mb-2">{featured.category}</span>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-3">{featured.title}</h2>
            <p className="text-stone-600 mb-6">{featured.excerpt}</p>
            <Link href={`/magazine/${featured.slug}`} className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium">
              Lire l&apos;article <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {rest.map((story) => (
          <article key={story.id} className="group">
            <Link href={`/magazine/${story.slug}`} className="block">
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 mb-4">
                <Image src={story.image} alt={story.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <span className="text-xs font-medium text-primary uppercase tracking-wider">{story.category}</span>
              <h3 className="font-serif text-lg font-bold text-stone-900 mt-1 mb-2 group-hover:text-primary transition-colors">{story.title}</h3>
              <p className="text-sm text-stone-600 line-clamp-2">{story.excerpt}</p>
            </Link>
          </article>
        ))}
      </div>

      {/* Newsletter */}
      <div className="mt-16 bg-sand p-8 md:p-12 text-center">
        <h3 className="text-2xl font-serif font-bold text-stone-900 mb-3">Restez inspires</h3>
        <p className="text-stone-600 mb-6 max-w-md mx-auto">
          Recevez nos meilleurs articles et nos nouveautes directement dans votre boite mail.
        </p>
        <div className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Votre email"
            className="flex-1 px-4 py-2.5 border border-stone-300 focus:outline-none focus:border-primary"
          />
          <button className="bg-primary text-white px-6 py-2.5 font-medium hover:bg-primary-dark transition-colors">
            S&apos;inscrire
          </button>
        </div>
      </div>
    </div>
  );
}
