import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, verifyPassword } from "@/lib/auth";
import { normalizeMobile } from "@/lib/format";

export const runtime = "nodejs";

/** Email ya 10-digit mobile + password se login. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { id?: string; password?: string } | null;
  const id = (body?.id ?? "").trim().toLowerCase();
  const password = body?.password ?? "";

  if (!id || !password) {
    return NextResponse.json({ error: "Enter your email/mobile and password." }, { status: 400 });
  }

  const mobile = normalizeMobile(id);
  const user = await prisma.user.findFirst({
    where: mobile ? { mobile } : { email: id },
  });

  // Ek hi message dono case ke liye — attacker ko pata na chale ki
  // email exist karta hai ya nahi.
  const invalid = NextResponse.json(
    { error: "That email/mobile or password is incorrect." },
    { status: 401 },
  );

  if (!user?.passwordHash) return invalid;
  if (!(await verifyPassword(password, user.passwordHash))) return invalid;

  await createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
  });

  return NextResponse.json({
    ok: true,
    redirect: user.role === "admin" ? "/admin" : "/dashboard",
  });
}
