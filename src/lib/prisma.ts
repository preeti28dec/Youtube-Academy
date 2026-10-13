import { PrismaClient } from "@prisma/client";
import { describeDbUrl, isSupportedDbUrl, resolveDbUrl } from "./db-url";

/**
 * URL khud resolve karke Prisma ko dete hain (schema ke env() par chhodne ke
 * bajaye), taaki quotes/space jaisi galtiyan yahin saaf ho jaayein aur
 * galat value par error samajh aane laayak ho.
 */
function databaseUrl(): string {
  const resolved = resolveDbUrl();

  if (!resolved) {
    throw new Error(
      "DATABASE_URL set nahi hai.\n" +
        "Hosting ke Environment Variables mein Postgres ka connection string daalein " +
        "(Production aur Preview dono), phir redeploy karein. " +
        "Details: VERCEL.md",
    );
  }

  if (!isSupportedDbUrl(resolved.url)) {
    throw new Error(
      `${resolved.from} sahi nahi lag raha: ${describeDbUrl(process.env[resolved.from])}\n` +
        "Value postgresql:// se shuru honi chahiye.\n" +
        "Sabse aam galti: value ko quotes ke saath paste kar dena. Dashboard mein " +
        'quotes NAHI lagani hoti — postgresql://user:pass@host/db likhein, "postgresql://..." nahi.',
    );
  }

  return resolved.url;
}

// Next.js dev mein hot-reload par naya client na bane, warna connection leak hota hai.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: databaseUrl(),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
