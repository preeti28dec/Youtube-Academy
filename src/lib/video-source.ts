/**
 * Lesson ka `videoKey` do shakal mein ho sakta hai:
 *
 *   "sample.mp4"                      -> local file, media/ folder se
 *   "https://cdn.example.com/x.mp4"   -> external host (Bunny, S3, R2, ...)
 *
 * Serverless (Vercel) par disk nahi hota, isliye wahan sirf doosri shakal
 * chalti hai. Dono case mein access-check pehle hota hai — stream route
 * tabhi kuch bhejta hai jab signed token aur session user match karein.
 */

export type VideoSource =
  | { kind: "file"; name: string }
  | { kind: "url"; url: string };

/** Vercel/serverless par writable disk nahi hota. */
export const IS_SERVERLESS = Boolean(process.env.VERCEL);

/**
 * Self-hosted setup mein video origin kabhi-kabhi apne hi network par hota hai
 * (LAN NAS, ya Docker compose ka MinIO/nginx). Tab yeh flag on karein.
 * Default off hai — public hosting par private network kholna theek nahi.
 */
const ALLOW_PRIVATE_HOSTS = process.env.VIDEO_ALLOW_PRIVATE_HOSTS === "1";

/**
 * Loopback aur private-network addresses block karte hain.
 *
 * videoKey sirf admin set karta hai, isliye yeh bada risk nahi — lekin yeh
 * sasta guard hai jo galti se (ya compromised admin se) server ko apne hi
 * internal network par request bhejne se rokta hai (SSRF).
 */
function isBlockedHost(hostname: string): boolean {
  if (ALLOW_PRIVATE_HOSTS) return false;
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (h === "localhost" || h.endsWith(".localhost") || h === "::1") return true;
  if (/^127\./.test(h) || /^0\./.test(h)) return true;
  if (/^10\./.test(h)) return true;
  if (/^192\.168\./.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return true;
  if (/^169\.254\./.test(h)) return true; // cloud metadata
  if (/^(fc|fd)/.test(h)) return true; // IPv6 unique-local
  return false;
}

export function parseVideoSource(videoKey: string | null): VideoSource | null {
  const key = (videoKey ?? "").trim();
  if (!key) return null;

  if (/^https?:\/\//i.test(key)) {
    let u: URL;
    try {
      u = new URL(key);
    } catch {
      return null;
    }
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (isBlockedHost(u.hostname)) return null;
    return { kind: "url", url: u.toString() };
  }

  // Local file — "../" jaise jugaad kaat dete hain.
  const name = key.split(/[\\/]/).pop() ?? "";
  if (!name || name === "." || name === "..") return null;
  return { kind: "file", name };
}
