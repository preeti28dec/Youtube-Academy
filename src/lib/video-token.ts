import crypto from "node:crypto";
import { env } from "./env";

/**
 * Short-lived signed video token.
 *
 * Link copy karke kisi aur ko bhejne par kaam nahi karega, kyunki token mein
 * user id bhi signed hai aur stream route use session user se match karta hai.
 * Expiry 2 minute — player token se stream shuru karta hai, aur token baasi
 * ho jaane ke baad wahi URL dobara nahi chalta.
 */
const TTL_SECONDS = 120;

type Payload = { lessonId: string; userId: string; exp: number };

function sign(data: string): string {
  return crypto.createHmac("sha256", env.videoSecret).update(data).digest("base64url");
}

export function createVideoToken(lessonId: string, userId: string): string {
  const exp = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const body = Buffer.from(JSON.stringify({ lessonId, userId, exp })).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifyVideoToken(token: string): Payload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  // timingSafeEqual length-sensitive hai, isliye pehle length compare.
  const expected = sign(body);
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as Payload;
    if (!payload.lessonId || !payload.userId) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export const VIDEO_TOKEN_TTL = TTL_SECONDS;
