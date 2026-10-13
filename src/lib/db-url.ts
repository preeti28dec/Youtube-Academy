/**
 * DATABASE_URL nikaalna aur saaf karna.
 *
 * Dashboard mein env var daalte waqt do galtiyan bahut aam hain:
 *
 *   1. value ko quotes ke saath paste kar dena — `"postgresql://..."`.
 *      .env file mein quotes chalti hain, lekin Vercel/Render jaise dashboard
 *      poori string ko literal maante hain, to URL `"` se shuru ho jaata hai
 *      aur Prisma "URL must start with postgresql://" phenk deta hai.
 *   2. aage/peeche space ya newline reh jaana.
 *
 * Dono yahan saaf ho jaate hain. Saath hi Vercel ke Postgres/Neon integration
 * wale naam bhi fallback ke roop mein dekh lete hain, kyunki woh kabhi
 * POSTGRES_PRISMA_URL / POSTGRES_URL set karta hai.
 */

const CANDIDATES = ["DATABASE_URL", "POSTGRES_PRISMA_URL", "POSTGRES_URL"] as const;

const SUPPORTED = ["postgresql://", "postgres://", "file:", "mysql://"];

export function cleanDbUrl(raw: string | undefined): string {
  return (raw ?? "")
    .trim()
    .replace(/^["']+/, "")
    .replace(/["']+$/, "")
    .trim();
}

/** Password dikhaye bina batata hai ki value kaisi lag rahi hai. */
export function describeDbUrl(raw: string | undefined): string {
  const v = (raw ?? "").trim();
  if (!v) return "(khaali)";
  const upto = v.indexOf("://");
  const head = upto > 0 ? v.slice(0, upto + 3) : v.slice(0, 12);
  return `"${head}..." (lambai ${v.length})`;
}

export type ResolvedDbUrl = { url: string; from: string };

/** Pehla candidate jo kuch value rakhta ho — saaf karke. */
export function resolveDbUrl(): ResolvedDbUrl | null {
  for (const name of CANDIDATES) {
    const url = cleanDbUrl(process.env[name]);
    if (url) return { url, from: name };
  }
  return null;
}

export function isSupportedDbUrl(url: string): boolean {
  return SUPPORTED.some((p) => url.startsWith(p));
}

/**
 * Kya DB chalne laayak configure hai?
 *
 * Middleware isi se decide karta hai ki asli site dikhani hai ya /setup page.
 * Isse hosting par config adhoori hone par bhi deploy green rehta hai aur
 * site khud bata deti hai ki kya baaki hai — crash ke bajaye.
 */
export function dbConfigured(): boolean {
  const r = resolveDbUrl();
  return Boolean(r && isSupportedDbUrl(r.url));
}

/** Setup page ko dikhane ke liye: kya kami hai. */
export function dbConfigProblem(): "missing" | "bad-protocol" | null {
  const r = resolveDbUrl();
  if (!r) return "missing";
  if (!isSupportedDbUrl(r.url)) return "bad-protocol";
  return null;
}
