import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { env } from "./env";
import { prisma } from "./prisma";

const COOKIE = "sya_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 din
const secret = new TextEncoder().encode(env.authSecret);

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
};

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/** httpOnly cookie — JS se padha nahi ja sakta, isliye XSS se token nahi churaya ja sakta. */
export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({ uid: user.id, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret);

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

/** Har request par DB se fresh user — role/ban changes turant lagu hote hain. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    const uid = payload.uid;
    if (typeof uid !== "string") return null;
    const user = await prisma.user.findUnique({
      where: { id: uid },
      select: { id: true, name: true, email: true, mobile: true, role: true },
    });
    return user;
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") throw new Error("FORBIDDEN");
  return user;
}

/** Course access check — Enrollment row hi single source of truth hai. */
export async function isEnrolled(userId: string, courseId: string): Promise<boolean> {
  const row = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: { id: true },
  });
  return Boolean(row);
}

/** Auto-generated pehla password (payment ke baad). Student ise baad mein badal sakta hai. */
export function generatePassword(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  for (const b of bytes) out += chars[b % chars.length];
  return out;
}
