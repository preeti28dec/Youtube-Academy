import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCourse } from "@/lib/course";
import { createGatewayOrder } from "@/lib/payment";
import { isValidEmail, normalizeMobile } from "@/lib/format";
import { env } from "@/lib/env";

export const runtime = "nodejs";

const METHODS = new Set(["upi", "card", "netbanking"]);

/**
 * Step 1 of checkout: student details lekar gateway order banata hai.
 * Yahan koi access nahi milta — access sirf payment confirm hone par (verify/webhook).
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    name?: string;
    mobile?: string;
    email?: string;
    method?: string;
  } | null;

  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const mobile = normalizeMobile(body.mobile ?? "");
  const method = METHODS.has(body.method ?? "") ? body.method! : "upi";

  if (!name || !mobile || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Enter your name, a 10-digit mobile number and a valid email." },
      { status: 400 },
    );
  }

  const course = await getCourse();
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  // Email aur mobile dono unique hain — dono se existing user dhoondhein.
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { mobile }] },
    select: { id: true, email: true, mobile: true },
  });

  if (existing) {
    const already = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: existing.id, courseId: course.id } },
      select: { id: true },
    });
    if (already) {
      return NextResponse.json(
        { error: "This email/mobile has already bought the course. Please log in." },
        { status: 409 },
      );
    }
    // Mismatch (email kisi aur ka, mobile kisi aur ka) par aage badhna safe nahi.
    if (existing.email !== email || existing.mobile !== mobile) {
      return NextResponse.json(
        { error: "This email or mobile is already registered. Log in, or use a different one." },
        { status: 409 },
      );
    }
  }

  const order = await createGatewayOrder(course.pricePaise, `sya_${Date.now()}`);

  // Pending order DB mein — webhook isi gatewayOrderId se row dhoondhta hai.
  await prisma.order.create({
    data: {
      // course bhi relation ke roop mein — scalar courseId + relation user mix
      // karne par Prisma "unchecked" create input chun leta hai aur type fail hota hai.
      course: { connect: { id: course.id } },
      amountPaise: course.pricePaise,
      status: "created",
      method,
      gatewayOrderId: order.gatewayOrderId,
      // User abhi exist nahi karta to placeholder nahi banate — details
      // verify step par hi user bana kar jodte hain. Tab tak pending order
      // ko buyer se jodne ke liye yahi gatewayOrderId kaafi hai.
      user: existing
        ? { connect: { id: existing.id } }
        : { create: { name, email, mobile, role: "student" } },
    },
  });

  return NextResponse.json({
    gatewayOrderId: order.gatewayOrderId,
    amountPaise: order.amountPaise,
    live: order.live,
    keyId: env.razorpayKeyId || null,
    courseTitle: course.title,
  });
}
