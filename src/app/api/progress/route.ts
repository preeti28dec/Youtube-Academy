import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

/** Lesson complete / incomplete toggle. */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login karein." }, { status: 401 });

  const body = (await req.json().catch(() => null)) as {
    lessonId?: string;
    completed?: boolean;
  } | null;
  const lessonId = body?.lessonId ?? "";
  const completed = Boolean(body?.completed);
  if (!lessonId) return NextResponse.json({ error: "lessonId missing" }, { status: 400 });

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { module: { select: { courseId: true } } },
  });
  if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

  // Progress sirf enrolled student ka save hota hai.
  const enrolled = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: lesson.module.courseId } },
    select: { id: true },
  });
  if (!enrolled) return NextResponse.json({ error: "Enrolled nahi hain." }, { status: 403 });

  await prisma.progress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    create: {
      userId: user.id,
      lessonId,
      completed,
      completedAt: completed ? new Date() : null,
    },
    update: { completed, completedAt: completed ? new Date() : null },
  });

  const [total, done] = await Promise.all([
    prisma.lesson.count({ where: { module: { courseId: lesson.module.courseId } } }),
    prisma.progress.count({
      where: {
        userId: user.id,
        completed: true,
        lesson: { module: { courseId: lesson.module.courseId } },
      },
    }),
  ]);

  return NextResponse.json({
    ok: true,
    completed,
    doneCount: done,
    total,
    pct: total ? Math.round((done / total) * 100) : 0,
  });
}
