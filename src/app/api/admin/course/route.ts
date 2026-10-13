import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { COURSE_SLUG } from "@/lib/course";

export const runtime = "nodejs";

/**
 * Course ki apni jaankari badalna — title, subtitle, description, price.
 *
 * Modules aur lessons ke liye alag routes hain; yeh sirf course row ko
 * chhoota hai, taaki Sohail bina developer ke apna text aur price badal sakein.
 */
export async function PATCH(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as {
    title?: string;
    subtitle?: string;
    description?: string;
    /// Rupees mein (jaise 1499) — DB mein paise ki tarah save hota hai.
    priceRupees?: number;
  } | null;

  const data: Record<string, unknown> = {};
  if (typeof body?.title === "string" && body.title.trim()) data.title = body.title.trim();
  if (typeof body?.subtitle === "string" && body.subtitle.trim())
    data.subtitle = body.subtitle.trim();
  if (typeof body?.description === "string" && body.description.trim())
    data.description = body.description.trim();

  if (body?.priceRupees !== undefined) {
    const rupees = Number(body.priceRupees);
    if (!Number.isFinite(rupees) || rupees < 1 || rupees > 1_000_000) {
      return NextResponse.json({ error: "Enter a price between ₹1 and ₹10,00,000." }, { status: 400 });
    }
    data.pricePaise = Math.round(rupees * 100);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  await prisma.course.update({ where: { slug: COURSE_SLUG }, data });
  return NextResponse.json({ ok: true });
}

/**
 * Poora course tree — ids ke saath.
 *
 * Admin UI ko iski zaroorat nahi (woh server component se data leta hai),
 * lekin content ko script se theek karne ke liye ids chahiye hote hain —
 * jaise jab saara text ek saath badalna ho.
 */
export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const course = await prisma.course.findUnique({
    where: { slug: COURSE_SLUG },
    select: {
      id: true,
      title: true,
      subtitle: true,
      description: true,
      pricePaise: true,
      modules: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            orderBy: { position: "asc" },
            select: { id: true, title: true, duration: true, isFree: true, position: true },
          },
        },
      },
    },
  });

  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
  return NextResponse.json(course);
}
