import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getCourse } from "@/lib/course";

export const runtime = "nodejs";

/** Naya module add. */
export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as { title?: string } | null;
  const title = (body?.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "Enter a module title." }, { status: 400 });

  const course = await getCourse();
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  const last = await prisma.module.findFirst({
    where: { courseId: course.id },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  const created = await prisma.module.create({
    data: { courseId: course.id, title, position: (last?.position ?? 0) + 1 },
  });

  return NextResponse.json({ ok: true, id: created.id });
}

/** Module ka naam badalna. */
export async function PATCH(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as { id?: string; title?: string } | null;
  const id = body?.id ?? "";
  const title = (body?.title ?? "").trim();
  if (!id || !title) {
    return NextResponse.json({ error: "Module id and title are required." }, { status: 400 });
  }

  await prisma.module.update({ where: { id }, data: { title } });
  return NextResponse.json({ ok: true });
}

/** Module delete — uske lessons bhi cascade se hat jaate hain. */
export async function DELETE(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!id) return NextResponse.json({ error: "id missing" }, { status: 400 });

  await prisma.module.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
