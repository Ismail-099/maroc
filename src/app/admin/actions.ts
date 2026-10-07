"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";

function refresh() {
  revalidatePath("/", "layout");
  redirect("/admin?saved=1");
}

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

// Returns "/uploads/xxx" path for an uploaded file, or null if none/invalid.
async function saveUpload(fd: FormData): Promise<string | null> {
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) return null;
  if (!file.type.startsWith("image/")) return null;
  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

// Uploaded file wins over the pasted URL.
async function resolveSrc(fd: FormData): Promise<string> {
  return (await saveUpload(fd)) ?? str(fd, "src");
}

export async function updateSiteImage(formData: FormData) {
  const id = str(formData, "id");
  if (!id) return;
  let src = await resolveSrc(formData);
  if (!src) {
    const cur = await prisma.siteImage.findUnique({ where: { id } });
    if (!cur) return;
    src = cur.src;
  }
  const data: { src: string; description?: string } = { src };
  if (formData.has("description")) data.description = str(formData, "description");
  await prisma.siteImage.update({ where: { id }, data });
  refresh();
}

export async function deleteSiteImage(formData: FormData) {
  const id = str(formData, "id");
  if (!id) return;
  await prisma.siteImage.delete({ where: { id } });
  refresh();
}

export async function toggleSiteImageActive(formData: FormData) {
  const id = str(formData, "id");
  if (!id) return;
  const cur = await prisma.siteImage.findUnique({ where: { id } });
  if (!cur) return;
  await prisma.siteImage.update({ where: { id }, data: { isActive: !cur.isActive } });
  refresh();
}

export async function addSiteImage(formData: FormData) {
  const group = str(formData, "group");
  const label = str(formData, "label") || "Nouvelle image";
  const description = str(formData, "description");
  const src = await resolveSrc(formData);
  if (!src || group !== "hero") return;
  const count = await prisma.siteImage.count({ where: { key: { startsWith: "hero-" } } });
  await prisma.siteImage.create({
    data: { key: `hero-${Date.now()}`, label: label || `Hero - slide ${count + 1}`, src, description },
  });
  refresh();
}

// Entity description field per model
const ENTITY_DESC_FIELD: Record<string, string> = {
  category: "description",
  artisan: "bio",
  story: "excerpt",
};

export async function updateEntity(formData: FormData) {
  const model = str(formData, "model");
  const id = str(formData, "id");
  if (!id || !(model in ENTITY_DESC_FIELD)) return;
  const src = await resolveSrc(formData);
  const data: Record<string, string | null> = {};
  if (formData.has("description")) data[ENTITY_DESC_FIELD[model]] = str(formData, "description");
  if (src) data.image = src;
  if (Object.keys(data).length === 0) return;
  await (prisma as any)[model].update({ where: { id }, data });
  refresh();
}

export async function clearEntityImage(formData: FormData) {
  const model = str(formData, "model");
  const id = str(formData, "id");
  if (!id || !["category", "artisan"].includes(model)) return;
  await (prisma as any)[model].update({ where: { id }, data: { image: null } });
  refresh();
}

export async function updateProductInfo(formData: FormData) {
  const id = str(formData, "id");
  const description = str(formData, "description");
  if (!id) return;
  await prisma.product.update({ where: { id }, data: { description } });
  refresh();
}

// Generic helpers for models with a pipe-separated `images` field (Product, Category).
const IMAGE_LIST_MODELS = ["product", "category"];

async function getImageList(model: string, id: string): Promise<string[]> {
  const row = await (prisma as any)[model].findUnique({ where: { id }, select: { images: true } });
  if (!row?.images) return [];
  return String(row.images)
    .split("|")
    .map((s: string) => s.trim())
    .filter(Boolean);
}

async function setImageList(model: string, id: string, images: string[]) {
  await (prisma as any)[model].update({ where: { id }, data: { images: images.join("|") } });
}

export async function addListImage(formData: FormData) {
  const model = str(formData, "model");
  const id = str(formData, "id");
  const src = await resolveSrc(formData);
  if (!IMAGE_LIST_MODELS.includes(model) || !id || !src) return;
  const images = await getImageList(model, id);
  images.push(src);
  await setImageList(model, id, images);
  refresh();
}

export async function updateListImage(formData: FormData) {
  const model = str(formData, "model");
  const id = str(formData, "id");
  const index = parseInt(str(formData, "index"), 10);
  const src = await resolveSrc(formData);
  if (!IMAGE_LIST_MODELS.includes(model) || !id || isNaN(index) || !src) return;
  const images = await getImageList(model, id);
  if (index < 0 || index >= images.length) return;
  images[index] = src;
  await setImageList(model, id, images);
  refresh();
}

export async function deleteListImage(formData: FormData) {
  const model = str(formData, "model");
  const id = str(formData, "id");
  const index = parseInt(str(formData, "index"), 10);
  if (!IMAGE_LIST_MODELS.includes(model) || !id || isNaN(index)) return;
  const images = await getImageList(model, id);
  if (images.length <= 1 || index < 0 || index >= images.length) return;
  images.splice(index, 1);
  await setImageList(model, id, images);
  refresh();
}

export async function deleteUploadedFile(formData: FormData) {
  const src = str(formData, "src");
  if (!src.startsWith("/uploads/")) return;
  const name = path.basename(src);
  await unlink(path.join(process.cwd(), "public", "uploads", name)).catch(() => {});
  refresh();
}
