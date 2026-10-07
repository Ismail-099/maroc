import { PrismaClient } from "@prisma/client";
import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";

function dbUrl() {
  const original = process.env.DATABASE_URL;
  if (process.env.VERCEL && process.env.NODE_ENV === "production") {
    const source = path.join(process.cwd(), "prisma", "dev.db");
    const tmpDb = path.join("/tmp", "dev.db");
    if (existsSync(source) && !existsSync(tmpDb)) {
      try {
        copyFileSync(source, tmpDb);
      } catch (err) {
        console.error("Failed to copy SQLite DB to /tmp", err);
      }
    }
    return `file:${tmpDb}`;
  }
  return original;
}

const resolvedDbUrl = dbUrl();
if (resolvedDbUrl) process.env.DATABASE_URL = resolvedDbUrl;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
