import Image from "next/image";
import { Images, LogOut, LibraryBig, Check, LayoutGrid, Plus } from "lucide-react";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { logout } from "./login/actions";
import {
  updateSiteImage,
  deleteSiteImage,
  addSiteImage,
  toggleSiteImageActive,
  updateEntity,
  clearEntityImage,
  updateProductInfo,
  addListImage,
  updateListImage,
  deleteListImage,
} from "./actions";
import ImageSourcePicker from "@/components/admin/ImageSourcePicker";
import LibraryItem from "@/components/admin/LibraryItem";
import SaveButton from "@/components/admin/SaveButton";
import ImageCard, { ImageCardBadge } from "@/components/admin/ImageCard";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin - Gestion des images" };

const PLACEMENT: Record<string, string> = {
  hero: "Accueil - Hero",
  "banner-catalogue": "Page Catalogue",
  "banner-magazine": "Page Magazine",
  "banner-contact": "Page Contact",
  "image-apropos": "Page A propos",
  "section-story": "Accueil - Histoire",
  "section-magazine": "Accueil - Magazine",
};

async function getUploads(): Promise<string[]> {
  try {
    const dir = path.join(process.cwd(), "public", "uploads");
    const files = await readdir(dir);
    return files
      .filter((f) => /\.(jpe?g|png|webp|gif|avif)$/i.test(f))
      .map((f) => `/uploads/${f}`)
      .reverse();
  } catch {
    return [];
  }
}

export default async function AdminPage({ searchParams }: { searchParams: { saved?: string } }) {
  const [siteImages, categories, artisans, products, stories, uploads] = await Promise.all([
    prisma.siteImage.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.artisan.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ include: { category: true }, orderBy: { name: "asc" } }),
    prisma.story.findMany({ orderBy: { title: "asc" } }),
    getUploads(),
  ]);

  const heroSlides = siteImages.filter((i) => i.key.startsWith("hero-"));
  const pageImages = siteImages.filter((i) => !i.key.startsWith("hero-"));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 flex items-center gap-3">
            <Images className="w-7 h-7 text-primary" /> Gestion des images
          </h1>
          <p className="text-sm text-stone-500 mt-2">
            Cliquez sur l&apos;icone crayon pour modifier une image, ou sur la poubelle pour la supprimer.
          </p>
        </div>
        <form action={logout}>
          <button type="submit" className="btn-outline flex items-center gap-2 shrink-0 text-xs">
            <LogOut className="w-3.5 h-3.5" /> Deconnexion
          </button>
        </form>
      </div>

      {searchParams.saved === "1" && (
        <div className="mb-8 border border-green-300 bg-green-50 text-green-800 text-sm px-4 py-3 flex items-center gap-2">
          <Check className="w-4 h-4" /> Modifications enregistrees.
        </div>
      )}

      {/* Library */}
      <Section title="Images importees" count={uploads.length} icon={<LibraryBig className="w-4 h-4" />}>
        {uploads.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {uploads.map((src) => (
              <LibraryItem key={src} src={src} />
            ))}
          </div>
        ) : (
          <Empty text="Aucune image importee. Utilisez le bouton Importer sur une carte." />
        )}
      </Section>

      {/* Hero */}
      <Section title="Diaporama Hero" count={heroSlides.length} icon={<LayoutGrid className="w-4 h-4" />}>
        <CardGrid>
          {heroSlides.map((img, idx) => (
            <ImageCard
              key={img.id}
              src={img.src}
              alt={img.description || img.label}
              title={`Slide ${idx + 1}`}
              description={img.description ?? ""}
              descriptionLabel="Description (alt)"
              badges={[
                { label: "Hero", variant: "primary" },
                { label: "Accueil", variant: "muted" },
              ]}
              status={img.isActive ? "active" : "inactive"}
              editAction={updateSiteImage}
              editHiddenInputs={<input type="hidden" name="id" value={img.id} />}
              deleteAction={deleteSiteImage}
              deleteHiddenInputs={<input type="hidden" name="id" value={img.id} />}
              toggleAction={toggleSiteImageActive}
              toggleHiddenInputs={<input type="hidden" name="id" value={img.id} />}
              uploads={uploads}
            />
          ))}
        </CardGrid>
        <AddSiteImageForm uploads={uploads} />
      </Section>

      {/* Page banners */}
      <Section title="Bannieres et sections" count={pageImages.length} icon={<LayoutGrid className="w-4 h-4" />}>
        <CardGrid>
          {pageImages.map((img) => (
            <ImageCard
              key={img.id}
              src={img.src}
              alt={img.description || img.label}
              title={img.label}
              description={img.description ?? ""}
              descriptionLabel="Description (alt)"
              badges={[{ label: PLACEMENT[img.key] ?? "Page", variant: "muted" }]}
              editAction={updateSiteImage}
              editHiddenInputs={<input type="hidden" name="id" value={img.id} />}
              uploads={uploads}
            />
          ))}
        </CardGrid>
      </Section>

      {/* Categories */}
      <Section title="Categories" count={categories.length} icon={<LayoutGrid className="w-4 h-4" />}>
        <div className="space-y-4">
          {categories.map((cat) => {
            const list = cat.images
              ? cat.images.split("|").map((s) => s.trim()).filter(Boolean)
              : [];
            return (
              <EntityBlock key={cat.id} name={cat.name}>
                <DescriptionForm
                  action={updateEntity}
                  hiddenInputs={[
                    <input key="m" type="hidden" name="model" value="category" />,
                    <input key="i" type="hidden" name="id" value={cat.id} />,
                  ]}
                  description={cat.description ?? ""}
                  label="Description de la categorie"
                />
                <CardGrid>
                  {list.map((src, idx) => (
                    <ImageCard
                      key={`${cat.id}-${idx}`}
                      src={src}
                      alt={cat.name}
                      title={`Image ${idx + 1}`}
                      badges={[{ label: cat.name, variant: "muted" }, { label: "Categorie" }]}
                      editAction={updateListImage}
                      editHiddenInputs={[
                        <input key="m" type="hidden" name="model" value="category" />,
                        <input key="i" type="hidden" name="id" value={cat.id} />,
                        <input key="x" type="hidden" name="index" value={idx} />,
                      ]}
                      deleteAction={list.length > 1 ? deleteListImage : undefined}
                      deleteHiddenInputs={[
                        <input key="m" type="hidden" name="model" value="category" />,
                        <input key="i" type="hidden" name="id" value={cat.id} />,
                        <input key="x" type="hidden" name="index" value={idx} />,
                      ]}
                      uploads={uploads}
                    />
                  ))}
                  <AddImageCard model="category" id={cat.id} uploads={uploads} />
                </CardGrid>
              </EntityBlock>
            );
          })}
        </div>
      </Section>

      {/* Artisans */}
      <Section title="Artisans" count={artisans.length} icon={<LayoutGrid className="w-4 h-4" />}>
        <CardGrid>
          {artisans.map((a) => (
            <ImageCard
              key={a.id}
              src={a.image ?? ""}
              alt={a.name}
              title={a.name}
              description={a.bio ?? ""}
              descriptionLabel="Biographie"
              badges={[{ label: "Artisan", variant: "muted" }, { label: a.specialty }]}
              editAction={updateEntity}
              editHiddenInputs={[
                <input key="m" type="hidden" name="model" value="artisan" />,
                <input key="i" type="hidden" name="id" value={a.id} />,
              ]}
              deleteAction={clearEntityImage}
              deleteHiddenInputs={[
                <input key="m" type="hidden" name="model" value="artisan" />,
                <input key="i" type="hidden" name="id" value={a.id} />,
              ]}
              uploads={uploads}
            />
          ))}
        </CardGrid>
      </Section>

      {/* Products */}
      <Section title="Produits" count={products.length} icon={<LayoutGrid className="w-4 h-4" />}>
        <div className="space-y-4">
          {products.map((p) => {
            const list = p.images
              .split("|")
              .map((s: string) => s.trim())
              .filter(Boolean);
            return (
              <EntityBlock key={p.id} name={p.name}>
                <DescriptionForm
                  action={updateProductInfo}
                  hiddenInputs={<input type="hidden" name="id" value={p.id} />}
                  description={p.description ?? ""}
                  label="Description du produit"
                />
                <CardGrid>
                  {list.map((src, idx) => (
                    <ImageCard
                      key={`${p.id}-${idx}`}
                      src={src}
                      alt={p.name}
                      title={`Image ${idx + 1}`}
                      badges={[{ label: p.category.name, variant: "muted" }, { label: "Produit" }]}
                      editAction={updateListImage}
                      editHiddenInputs={[
                        <input key="m" type="hidden" name="model" value="product" />,
                        <input key="i" type="hidden" name="id" value={p.id} />,
                        <input key="x" type="hidden" name="index" value={idx} />,
                      ]}
                      deleteAction={list.length > 1 ? deleteListImage : undefined}
                      deleteHiddenInputs={[
                        <input key="m" type="hidden" name="model" value="product" />,
                        <input key="i" type="hidden" name="id" value={p.id} />,
                        <input key="x" type="hidden" name="index" value={idx} />,
                      ]}
                      uploads={uploads}
                    />
                  ))}
                  <AddImageCard model="product" id={p.id} uploads={uploads} />
                </CardGrid>
              </EntityBlock>
            );
          })}
        </div>
      </Section>

      {/* Stories */}
      <Section title="Magazine" count={stories.length} icon={<LayoutGrid className="w-4 h-4" />}>
        <CardGrid>
          {stories.map((s) => (
            <ImageCard
              key={s.id}
              src={s.image}
              alt={s.title}
              title={s.title}
              description={s.excerpt}
              descriptionLabel="Resume"
              badges={[{ label: "Article", variant: "muted" }, { label: s.category }]}
              editAction={updateEntity}
              editHiddenInputs={[
                <input key="m" type="hidden" name="model" value="story" />,
                <input key="i" type="hidden" name="id" value={s.id} />,
              ]}
              uploads={uploads}
            />
          ))}
        </CardGrid>
      </Section>
    </div>
  );
}

function Section({ title, count, icon, children }: { title: string; count: number; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <div className="mb-5 border-b border-stone-200 pb-2 flex items-center gap-2">
        {icon}
        <h2 className="text-base font-serif font-bold text-stone-900">{title}</h2>
        <span className="text-xs text-stone-400">({count})</span>
      </div>
      {children}
    </section>
  );
}

function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{children}</div>;
}

function EntityBlock({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="border border-stone-200 bg-white p-4">
      <h3 className="font-medium text-stone-900 text-sm mb-3">{name}</h3>
      {children}
    </div>
  );
}

function DescriptionForm({
  action,
  hiddenInputs,
  description,
  label,
}: {
  action: (fd: FormData) => Promise<void>;
  hiddenInputs: React.ReactNode;
  description: string;
  label: string;
}) {
  return (
    <form action={action} className="flex gap-2 items-start mb-4">
      {hiddenInputs}
      <div className="flex-1 min-w-0">
        <label className="text-[10px] uppercase tracking-wider text-stone-500 mb-1 block">{label}</label>
        <textarea name="description" rows={2} defaultValue={description} className="input" />
      </div>
      <SaveButton className="self-start" />
    </form>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-sm text-stone-400 italic">{text}</p>;
}

function AddSiteImageForm({ uploads }: { uploads: string[] }) {
  return (
    <form action={addSiteImage} className="mt-4 border border-dashed border-stone-300 bg-white p-4 max-w-xl">
      <p className="text-xs font-semibold text-stone-700 mb-2">Ajouter une slide Hero</p>
      <input type="hidden" name="group" value="hero" />
      <input name="label" placeholder="Nom de la slide" className="input mb-2" />
      <ImageSourcePicker uploads={uploads} />
      <textarea name="description" rows={2} placeholder="Description (alt)" className="input mt-2" />
      <SaveButton label="Ajouter" variant="outline" className="mt-2" />
    </form>
  );
}

function AddImageCard({ model, id, uploads }: { model: "category" | "product"; id: string; uploads: string[] }) {
  return (
    <form action={addListImage} className="border border-dashed border-stone-300 bg-stone-50/50 p-4 flex flex-col justify-center min-h-[220px]">
      <input type="hidden" name="model" value={model} />
      <input type="hidden" name="id" value={id} />
      <div className="text-center mb-3">
        <Plus className="w-8 h-8 text-stone-300 mx-auto" />
        <p className="text-xs text-stone-500 mt-1">Ajouter une image</p>
      </div>
      <ImageSourcePicker uploads={uploads} showLibrary={false} />
      <SaveButton label="Ajouter" variant="outline" className="mt-2" />
    </form>
  );
}
