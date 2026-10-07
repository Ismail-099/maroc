import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const cat1 = await prisma.category.create({ data: { name: "Poterie & Ceramique", slug: "poterie-ceramique", description: "Vases, plats et objets en terre cuite", images: "https://images.unsplash.com/photo-1771148885308-7cbae216fb10?w=800" } });
  const cat2 = await prisma.category.create({ data: { name: "Textiles & Tapis", slug: "textiles-tapis", description: "Tapis berberes, coussins et tissages", images: "https://images.unsplash.com/photo-1767390552768-6703f91c2518?w=800" } });
  const cat3 = await prisma.category.create({ data: { name: "Bois & Sculpture", slug: "bois-sculpture", description: "Meubles et objets sculptes a la main", images: "https://images.unsplash.com/photo-1759523146335-0069847ceb16?w=800" } });
  const cat4 = await prisma.category.create({ data: { name: "Cuir & Maroquinerie", slug: "cuir-maroquinerie", description: "Sacs, babouches et accessoires en cuir", images: "https://images.unsplash.com/photo-1745837893977-34f76b11f644?w=800" } });
  const cat5 = await prisma.category.create({ data: { name: "Luminaires", slug: "luminaires", description: "Lanternes et appliques marocaines", images: "https://images.unsplash.com/photo-1760727467316-4c190481b4d1?w=800" } });
  const cat6 = await prisma.category.create({ data: { name: "Decoration", slug: "decoration", description: "Objets decoratifs et accessoires", images: "https://images.unsplash.com/photo-1753740023014-143ab3536662?w=800" } });

  const art1 = await prisma.artisan.create({ data: { name: "Fatima Zahra", slug: "fatima-zahra", region: "Marrakech", specialty: "Poterie", bio: "Artisane passionnee depuis plus de 20 ans, Fatima Zahra perpétue les techniques ancestrales de la poterie de Safi. Chaque piece est unique et raconte une histoire.", rating: 4.9, reviewCount: 127, image: "https://plus.unsplash.com/premium_photo-1663040237172-c8974380a5d6?w=800" } });
  const art2 = await prisma.artisan.create({ data: { name: "Ahmed Benkiran", slug: "ahmed-benkiran", region: "Fes", specialty: "Zellige", bio: "Maitre zelligeur forme a Fes, Ahmed cree des motifs geometriques complexes avec une precision millimetree.", rating: 4.8, reviewCount: 89, image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800" } });
  const art3 = await prisma.artisan.create({ data: { name: "Youssef El Amrani", slug: "youssef-el-amrani", region: "Marrakech", specialty: "Cuir", bio: "Tanneur et maroquinier de pere en fils, Youssef travaille le cuir avec passion depuis 15 ans.", rating: 4.7, reviewCount: 203, image: "https://images.unsplash.com/photo-1745837893977-34f76b11f644?w=800" } });
  const art4 = await prisma.artisan.create({ data: { name: "Aicha Bennani", slug: "aicha-bennani", region: "Chefchaouen", specialty: "Tissage", bio: "Tisseuse berbere issue d'une longue tradition, Aicha cree des tapis aux motifs uniques.", rating: 5.0, reviewCount: 56, image: "https://images.unsplash.com/photo-1767390552768-6703f91c2518?w=800" } });
  const art5 = await prisma.artisan.create({ data: { name: "Mohamed Idrissi", slug: "mohamed-idrissi", region: "Essaouira", specialty: "Bois", bio: "Ebeniste passionne, Mohamed sculpte le thuya avec une dexterite remarquable.", rating: 4.6, reviewCount: 74, image: "https://images.unsplash.com/photo-1759523146335-0069847ceb16?w=800" } });

  const products = await prisma.product.createMany({
    data: [
      { name: "Vase en ceramique berbere", slug: "vase-ceramique-berbere", description: "Ce vase en ceramique berbere est entierement fait a la main par Fatima Zahra, artisane a Marrakech. Chaque piece est unique et raconte une histoire.", price: 450, images: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600|https://plus.unsplash.com/premium_photo-1663040237172-c8974380a5d6?w=600|https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600|https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600", inStock: true, rating: 4.8, reviewCount: 12, material: "Terre cuite", dimensions: "25 cm (hauteur)", technique: "Tournage et peinture a la main", deliveryTime: "3 a 7 jours", categoryId: cat1.id, artisanId: art1.id },
      { name: "Tapis Beni Ouarain", slug: "tapis-beni-ouarain", description: "Tapis berbere authentique tisse a la main en laine de mouton. Motifs geometriques traditionnels sur fond ecru.", price: 2800, images: "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=600", inStock: true, rating: 4.9, reviewCount: 34, material: "Laine de mouton", dimensions: "200 x 300 cm", technique: "Tissage a la main", deliveryTime: "5 a 10 jours", categoryId: cat2.id, artisanId: art4.id },
      { name: "Table en bois sculpte", slug: "table-bois-sculpte", description: "Table basse en bois de thuya sculpte a la main. Motifs floraux traditionnels marocains.", price: 3500, images: "https://images.unsplash.com/photo-1759523146335-0069847ceb16?w=600", inStock: true, rating: 4.7, reviewCount: 8, material: "Bois de thuya", dimensions: "120 x 60 x 45 cm", technique: "Sculpture a la main", deliveryTime: "7 a 14 jours", categoryId: cat3.id, artisanId: art5.id },
      { name: "Sac en cuir fait main", slug: "sac-cuir-fait-main", description: "Sac a main en cuir de qualite superieure, travaille et cousu entierement a la main.", price: 1300, images: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600", inStock: true, rating: 4.6, reviewCount: 45, material: "Cuir de vache", dimensions: "30 x 25 x 12 cm", technique: "Couture et tannage traditionnel", deliveryTime: "3 a 5 jours", categoryId: cat4.id, artisanId: art3.id },
      { name: "Lampe en laiton", slug: "lampe-laiton", description: "Lampe de table en laiton cisele avec motifs ajoures. Effet lumineux magique une fois allumee.", price: 1800, images: "https://images.unsplash.com/photo-1760727467316-4c190481b4d1?w=600", inStock: true, rating: 4.8, reviewCount: 22, material: "Laiton", dimensions: "40 cm (hauteur)", technique: "Ciselure et gravure", deliveryTime: "3 a 7 jours", categoryId: cat5.id, artisanId: art2.id },
      { name: "Panier en palmier", slug: "panier-palmier", description: "Panier tresse en feuilles de palmier, parfait pour le rangement ou la decoration.", price: 250, images: "https://images.unsplash.com/photo-1767390552768-6703f91c2518?w=600", inStock: true, rating: 4.5, reviewCount: 67, material: "Palmier", dimensions: "35 x 25 cm", technique: "Tressage traditionnel", deliveryTime: "2 a 4 jours", categoryId: cat6.id, artisanId: art1.id },
      { name: "Coussin berbere", slug: "coussin-berbere", description: "Coussin en laine avec motifs berberes colores. Remplissage en laine de mouton.", price: 350, images: "https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?w=600", inStock: true, rating: 4.7, reviewCount: 19, material: "Laine", dimensions: "45 x 45 cm", technique: "Tissage et broderie", deliveryTime: "3 a 5 jours", categoryId: cat2.id, artisanId: art4.id },
      { name: "Service a the marocain", slug: "service-the-marocain", description: "Service a the complet avec theiere, verres et plateau. Decor traditionnel en metal grave.", price: 600, images: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600", inStock: true, rating: 4.9, reviewCount: 41, material: "Metal et verre", dimensions: "Theiere 1L, 6 verres", technique: "Gravure et email", deliveryTime: "3 a 7 jours", categoryId: cat6.id, artisanId: art2.id },
      { name: "Miroir arche sculpte", slug: "miroir-arche-sculpte", description: "Miroir avec cadre en bois sculpte en forme d'arche. Motifs floraux et geometriques.", price: 1100, images: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600", inStock: true, rating: 4.6, reviewCount: 15, material: "Bois de thuya", dimensions: "80 x 60 cm", technique: "Sculpture a la main", deliveryTime: "5 a 10 jours", categoryId: cat6.id, artisanId: art5.id },
      { name: "Babouche en cuir", slug: "babouche-cuir", description: "Babouche traditionnelle en cuir souple, cousue a la main. Confortable et elegante.", price: 320, images: "https://images.unsplash.com/photo-1777980808039-c8be538797f0?w=600", inStock: true, rating: 4.4, reviewCount: 88, material: "Cuir", dimensions: "Pointure sur mesure", technique: "Couture traditionnelle", deliveryTime: "3 a 5 jours", categoryId: cat4.id, artisanId: art3.id },
      { name: "Bol en ceramique Safi", slug: "bol-ceramique-safi", description: "Bol en ceramique emaillee avec motifs bleus traditionnels de Safi.", price: 180, images: "https://images.unsplash.com/photo-1771148885308-7cbae216fb10?w=600", inStock: true, rating: 4.7, reviewCount: 53, material: "Terre cuite emaillee", dimensions: "20 cm (diametre)", technique: "Email et peinture a la main", deliveryTime: "3 a 7 jours", categoryId: cat1.id, artisanId: art1.id },
      { name: "Vase marocain", slug: "vase-marocain", description: "Vase haut en ceramique avec motifs geometriques traditionnels.", price: 480, images: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600", inStock: true, rating: 4.5, reviewCount: 9, material: "Terre cuite", dimensions: "35 cm (hauteur)", technique: "Tournage et peinture", deliveryTime: "3 a 7 jours", categoryId: cat1.id, artisanId: art1.id },
      { name: "Plateau decoratif", slug: "plateau-decoratif", description: "Plateau en bois incruste de metal avec motifs arabesques.", price: 750, images: "https://images.unsplash.com/photo-1753740023014-143ab3536662?w=600", inStock: true, rating: 4.8, reviewCount: 27, material: "Bois et metal", dimensions: "40 cm (diametre)", technique: "Incrustation et gravure", deliveryTime: "5 a 10 jours", categoryId: cat6.id, artisanId: art5.id },
      { name: "Tasse berbere", slug: "tasse-berbere", description: "Tasse en ceramique peinte a la main avec motifs berberes.", price: 280, images: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600", inStock: true, rating: 4.6, reviewCount: 31, material: "Ceramique", dimensions: "300 ml", technique: "Peinture a la main", deliveryTime: "3 a 5 jours", categoryId: cat1.id, artisanId: art1.id },
    ],
  });

  const stories = await prisma.story.createMany({
    data: [
      { title: "L'art de la poterie a Safi", slug: "art-poterie-safi", excerpt: "Decouvrez les secrets de la poterie marocaine dans la ville historique de Safi.", content: "La poterie de Safi est reconnue dans le monde entier pour ses motifs bleus et blancs inspires de la mer et du ciel. Les artisans perpetuent une tradition millenaire...", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800", category: "Artisanat" },
      { title: "Les tapis berberes, un heritage vivant", slug: "tapis-berberes-heritage", excerpt: "Chaque tapis berbere raconte une histoire a travers ses motifs et ses couleurs.", content: "Les tapis berberes sont bien plus que de simples objets decoratifs. Chaque motif, chaque couleur porte un sens...", image: "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=800", category: "Artisanat" },
      { title: "Portrait : Fatima Zahra, artisane de Marrakech", slug: "portrait-fatima-zahra", excerpt: "Rencontre avec une artisane qui consacre sa vie a la preservation des savoir-faire traditionnels.", content: "Fatima Zahra a appris la poterie de sa mere, qui l'avait elle-meme apprise de sa propre mere...", image: "https://plus.unsplash.com/premium_photo-1663040237172-c8974380a5d6?w=800", category: "Artisans", artisanId: art1.id },
      { title: "Le cuir de Fes, une richesse du Maroc", slug: "cuir-fes-richesse", excerpt: "Les tanneries de Fes produisent depuis des siecles un cuir d'exception.", content: "Les tanneries Chouara de Fes sont les plus anciennes au monde encore en activite...", image: "https://images.unsplash.com/photo-1745837893977-34f76b11f644?w=800", category: "Artisanat" },
    ],
  });

  const partners = await prisma.partner.createMany({
    data: [
      { name: "Riad & Spa", logo: "R&S", order: 1 },
      { name: "Four Seasons", logo: "FS", order: 2 },
      { name: "Hilton", logo: "H", order: 3 },
      { name: "Marriott", logo: "M", order: 4 },
      { name: "Airbnb", logo: "A", order: 5 },
      { name: "Dior", logo: "D", order: 6 },
      { name: "L'Oreal", logo: "L", order: 7 },
    ],
  });

  const testimonials = await prisma.testimonial.createMany({
    data: [
      { name: "Riad El Fenn", role: "Marrakech", content: "Nous decorons nos suites avec les creations d'Artisanat Maroc depuis 3 ans. La qualite est exceptionnelle." },
      { name: "Hotel Selman", role: "Marrakech", content: "Un partenaire de confiance qui nous fournit des pieces uniques et authentiques. Tres recommande." },
    ],
  });

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
