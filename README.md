# Artisanat Maroc

Plateforme e-commerce et vitrine pour l'artisanat marocain. Next.js 14 + TypeScript + Tailwind CSS + Prisma + SQLite.

## Pages

- **Accueil** (`/`) - Hero, selection de categories, histoire, apercu magazine
- **Catalogue** (`/catalogue`) - Produits avec filtres par categorie
- **Produit** (`/produit/[slug]`) - Detail produit, artisan, similaires
- **Artisans** (`/artisans`) - Liste des artisans
- **Artisan** (`/artisan/[slug]`) - Profil artisan avec creations
- **Magazine** (`/magazine`) - Articles et histoires
- **Confiance** (`/confiance`) - Partenaires, temoignages, stats
- **Contact** (`/contact`) - Formulaire + WhatsApp
- **A propos** (`/a-propos`) - Mission et valeurs

## Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js Server Components + Server Actions
- **Database**: Prisma ORM + SQLite
- **UI**: Lucide React icons

## Installation

1. Installer les dependances :
```bash
npm install
```

2. Generer le client Prisma et creer la base de donnees :
```bash
npx prisma generate
npx prisma migrate dev --name init
```

3. Remplir la base de donnees avec les donnees de test :
```bash
npx ts-node prisma/seed.ts
```

4. Lancer le serveur de developpement :
```bash
npm run dev
```

5. Ouvrir [http://localhost:3000](http://localhost:3000)

## Structure

```
prisma/
  schema.prisma   # Modeles Category, Artisan, Product, Story, Partner, Testimonial
  seed.ts         # Donnees de demo
src/
  app/            # Pages Next.js (App Router)
  components/     # Navbar, Footer
  lib/            # prisma.ts, utils.ts
```

## Notes

- Les images utilisent Unsplash (configurer dans `next.config.mjs`)
- Les donnees sont recuperees via Prisma dans les Server Components
- Le schema peut etre etendu pour ajouter panier, commandes, utilisateurs
