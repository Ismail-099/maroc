import { prisma } from "@/lib/prisma";

export async function getSiteImage(key: string, fallback: string): Promise<string> {
  const row = await prisma.siteImage.findUnique({ where: { key } });
  return (row?.src && row.isActive) ? row.src : fallback;
}

export interface SiteImageRecord {
  src: string;
  alt: string;
  description: string;
  label: string;
}

export async function getSiteImageDetails(key: string, fallbackSrc: string, fallbackDesc?: string): Promise<SiteImageRecord> {
  const row = await prisma.siteImage.findUnique({ where: { key } });
  if (row?.src && row.isActive) {
    return {
      src: row.src,
      alt: row.description || row.label,
      description: row.description || fallbackDesc || "",
      label: row.label,
    };
  }
  return {
    src: fallbackSrc,
    alt: fallbackDesc || "",
    description: fallbackDesc || "",
    label: "",
  };
}

export async function getHeroSlides(): Promise<{ src: string; alt: string }[]> {
  const rows = await prisma.siteImage.findMany({
    where: { key: { startsWith: "hero-" }, isActive: true },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((r) => ({ src: r.src, alt: r.description || r.label }));
}

