import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { toSeconds } from "@/lib/format";

export const runtime = "nodejs";

async function guard() {
  try {
    await requireAdmin();
    return null;
  } catch {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }
}

/** Naya lesson add. */
export async function POST(req: Request) {
  const denied = await guard();
  if (denied) return denied;

  const body = (await req.json().catch(() => null)) as {
    moduleId?: string;
    title?: string;
    duration?: string;
    isFree?: boolean;
    videoKey?: string;
  } | null;

  const moduleId = body?.moduleId ?? "";
  const title = (body?.title ?? "").trim();
  if (!moduleId || !title) {
    return NextResponse.json({ error: "Module and lesson title are required." }, { status: 400 });
  }

  const mod = await prisma.module.findUnique({ where: { id: moduleId }, select: { id: true } });
  if (!mod) return NextResponse.json({ error: "Module not found" }, { status: 404 });

  const duration = (body?.duration ?? "").trim() || "00:00";
  const last = await prisma.lesson.findFirst({
    where: { moduleId },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  const created = await prisma.lesson.create({
    data: {
      moduleId,
      title,
      duration,
      durationSec: toSeconds(duration),
      isFree: Boolean(body?.isFree),
      videoKey: (body?.videoKey ?? "").trim() || null,
      position: (last?.position ?? 0) + 1,
    },
  });

  return NextResponse.json({ ok: true, id: created.id });
}

/** Lesson edit — title, duration, free flag, video. */
export async function PATCH(req: Request) {
  const denied = await guard();
  if (denied) return denied;

  const body = (await req.json().catch(() => null)) as {
    id?: string;
    title?: string;
    duration?: string;
    isFree?: boolean;
    videoKey?: string;
  } | null;

  const id = body?.id ?? "";
  if (!id) return NextResponse.json({ error: "id missing" }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (typeof body?.title === "string" && body.title.trim()) data.title = body.title.trim();
  if (typeof body?.duration === "string" && body.duration.trim()) {
    data.duration = body.duration.trim();
    data.durationSec = toSeconds(body.duration.trim());
  }
  if (typeof body?.isFree === "boolean") data.isFree = body.isFree;
  if (typeof body?.videoKey === "string") data.videoKey = body.videoKey.trim() || null;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  await prisma.lesson.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const denied = await guard();
  if (denied) return denied;

  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!id) return NextResponse.json({ error: "id missing" }, { status: 400 });

  await prisma.lesson.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
