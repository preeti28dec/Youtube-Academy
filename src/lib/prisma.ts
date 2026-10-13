import { PrismaClient } from "@prisma/client";
import { describeDbUrl, isSupportedDbUrl, resolveDbUrl } from "./db-url";

/**
 * URL khud resolve karke Prisma ko dete hain (schema ke env() par chhodne ke
 * bajaye), taaki quotes/space jaisi galtiyan yahin saaf ho jaayein aur galat
 * value par error samajh aane laayak ho.
 */
function databaseUrl(): string {
  const resolved = resolveDbUrl();

  if (!resolved) {
    throw new Error(
      "DATABASE_URL set nahi hai.\n" +
        "Hosting ke Environment Variables mein Postgres ka connection string daalein " +
        "(Production aur Preview dono), phir redeploy karein. Details: VERCEL.md",
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

// Dev mein hot-reload par naya client na bane, warna connection leak hota hai.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

let client: PrismaClient | undefined = globalForPrisma.prisma;

function getClient(): PrismaClient {
  if (!client) {
    client = new PrismaClient({
      datasourceUrl: databaseUrl(),
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  }
  return client;
}

/**
 * Client pehli asli query par banta hai, import par nahi — aur uske baad
 * cache ho jaata hai.
 *
 * Lazy hona zaroori hai: DATABASE_URL na hone par middleware request ko /setup
 * par bhej deta hai, lekin layout phir bhi is module ko import karta hai. Agar
 * yahan import-time par throw hota, to setup page bhi 500 de deta aur user ko
 * pata hi nahi chalta ki karna kya hai.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const value = Reflect.get(getClient(), prop);
    return typeof value === "function" ? value.bind(getClient()) : value;
  },
});
