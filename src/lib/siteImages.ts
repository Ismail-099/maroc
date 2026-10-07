import { prisma } from "@/lib/prisma";

export async function getSiteImage(key: string, fallback: string): Promise<string> {
  const row = await prisma.siteImage.findUnique({ where: { key } });
  return (row?.src && row.isActive) ? row.src : fallback;
}

export async function getHeroSlides(): Promise<{ src: string; alt: string }[]> {
  const rows = await prisma.siteImage.findMany({
    where: { key: { startsWith: "hero-" }, isActive: true },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((r) => ({ src: r.src, alt: r.description || r.label }));
}
