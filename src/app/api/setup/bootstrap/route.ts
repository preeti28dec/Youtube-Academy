import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { isValidEmail, normalizeMobile } from "@/lib/format";
import { COURSE, SYLLABUS, toSeconds } from "@/lib/starter-content";

export const runtime = "nodejs";

/**
 * Pehli baar database bharne ke liye — course ka shuruaati syllabus aur ek
 * admin account.
 *
 * Yeh khulla endpoint nahi hai: sirf tab chalta hai jab database mein ek bhi
 * user aur ek bhi course na ho. Pehli baar chalne ke baad yeh hamesha 409
 * deta hai, isliye koi ise dobara use karke data nahi badal sakta.
 *
 * Zaroorat isliye padti hai ki hosting par seed script chalane ke liye
 * DATABASE_URL chahiye hota hai, jo (sahi hi) sensitive rakha jaata hai.
 */
export async function POST(req: Request) {
  const [users, courses] = await Promise.all([prisma.user.count(), prisma.course.count()]);
  if (users > 0 || courses > 0) {
    return NextResponse.json(
      { error: "Setup has already run. This only works on a completely empty database." },
      { status: 409 },
    );
  }

  const body = (await req.json().catch(() => null)) as {
    name?: string;
    email?: string;
    mobile?: string;
    password?: string;
  } | null;

  const name = (body?.name ?? "").trim() || "Admin";
  const email = (body?.email ?? "").trim().toLowerCase();
  const mobile = normalizeMobile(body?.mobile ?? "");
  const password = body?.password ?? "";

  if (!isValidEmail(email) || !mobile) {
    return NextResponse.json(
      { error: "Enter a valid email and a 10-digit mobile number." },
      { status: 400 },
    );
  }
  if (password.length < 12) {
    return NextResponse.json(
      { error: "The password must be at least 12 characters." },
      { status: 400 },
    );
  }

  const course = await prisma.course.create({ data: COURSE });

  for (const [mi, [moduleTitle, lessons]] of SYLLABUS.entries()) {
    await prisma.module.create({
      data: {
        courseId: course.id,
        title: moduleTitle,
        position: mi + 1,
        lessons: {
          create: lessons.map(([title, duration, isFree], li) => ({
            title,
            duration,
            durationSec: toSeconds(duration),
            isFree: Boolean(isFree),
            position: li + 1,
            // Video abhi nahi hai — admin panel se URL ya file jodi jayegi.
            videoKey: null,
          })),
        },
      },
    });
  }

  await prisma.user.create({
    data: {
      name,
      email,
      mobile,
      passwordHash: await hashPassword(password),
      role: "admin",
    },
  });

  const lessonCount = await prisma.lesson.count();
  return NextResponse.json({
    ok: true,
    modules: SYLLABUS.length,
    lessons: lessonCount,
  });
}

/** Setup page poochta hai: DB khaali hai ya nahi. */
export async function GET() {
  const [users, courses] = await Promise.all([prisma.user.count(), prisma.course.count()]);
  return NextResponse.json({ empty: users === 0 && courses === 0, users, courses });
}
