import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, requireAdmin } from "@/lib/auth";
import { isValidEmail, normalizeMobile } from "@/lib/format";
import { getCourse } from "@/lib/course";

export const runtime = "nodejs";

/** Admin khud set kare to itna hi kaafi — student khud banaye to policy alag ho sakti hai. */
const MIN_PASSWORD = 8;

async function guard() {
  try {
    await requireAdmin();
    return null;
  } catch {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }
}

/**
 * Naya user banana — aur chaahein to use course mein enroll bhi kar dena.
 *
 * Kaam aata hai: testing ke liye student account, ya kisi ko bina payment
 * ke access dena (jaise koi UPI se seedha paisa bhej de).
 */
export async function POST(req: Request) {
  const denied = await guard();
  if (denied) return denied;

  const body = (await req.json().catch(() => null)) as {
    name?: string;
    email?: string;
    mobile?: string;
    password?: string;
    role?: string;
    enroll?: boolean;
  } | null;

  const name = (body?.name ?? "").trim();
  const email = (body?.email ?? "").trim().toLowerCase();
  const mobile = normalizeMobile(body?.mobile ?? "");
  const password = body?.password ?? "";
  const role = body?.role === "admin" ? "admin" : "student";

  if (!name || !isValidEmail(email) || !mobile) {
    return NextResponse.json(
      { error: "Name, a valid email and a 10-digit mobile number are required." },
      { status: 400 },
    );
  }
  if (password.length < MIN_PASSWORD) {
    return NextResponse.json(
      { error: `The password must be at least ${MIN_PASSWORD} characters.` },
      { status: 400 },
    );
  }

  const clash = await prisma.user.findFirst({
    where: { OR: [{ email }, { mobile }] },
    select: { id: true },
  });
  if (clash) {
    return NextResponse.json(
      { error: "A user with that email or mobile already exists." },
      { status: 409 },
    );
  }

  const user = await prisma.user.create({
    data: { name, email, mobile, role, passwordHash: await hashPassword(password) },
  });

  let enrolled = false;
  if (body?.enroll) {
    const course = await getCourse();
    if (course) {
      await prisma.enrollment.create({ data: { userId: user.id, courseId: course.id } });
      enrolled = true;
    }
  }

  return NextResponse.json({ ok: true, id: user.id, role, enrolled });
}

/**
 * Password badalna — apna ya kisi student ka.
 *
 * Abhi "forgot password" flow nahi hai, isliye reset ka yahi raasta hai.
 */
export async function PATCH(req: Request) {
  const denied = await guard();
  if (denied) return denied;

  const body = (await req.json().catch(() => null)) as {
    email?: string;
    password?: string;
    enroll?: boolean;
  } | null;

  const email = (body?.email ?? "").trim().toLowerCase();
  const password = body?.password ?? "";

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (password.length < MIN_PASSWORD) {
    return NextResponse.json(
      { error: `The password must be at least ${MIN_PASSWORD} characters.` },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "No user with that email." }, { status: 404 });

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(password) },
  });

  let enrolled = false;
  if (body?.enroll) {
    const course = await getCourse();
    if (course) {
      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId: user.id, courseId: course.id } },
        create: { userId: user.id, courseId: course.id },
        update: {},
      });
      enrolled = true;
    }
  }

  return NextResponse.json({ ok: true, enrolled });
}
