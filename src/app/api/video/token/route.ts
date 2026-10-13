import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createVideoToken, VIDEO_TOKEN_TTL } from "@/lib/video-token";

export const runtime = "nodejs";

/**
 * Lesson ka playback token.
 *
 * Access check yahan hota hai, player mein nahi:
 *   - free preview lesson  -> sabko
 *   - baaki sabhi lessons  -> sirf us course mein enrolled student ko
 *
 * Token 2 minute ka hai aur usme user id bhi signed hai, isliye link copy
 * karke kisi aur ko bhejne par woh nahi chalega.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { lessonId?: string } | null;
  const lessonId = body?.lessonId ?? "";
  if (!lessonId) return NextResponse.json({ error: "lessonId missing" }, { status: 400 });

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, isFree: true, module: { select: { courseId: true } } },
  });
  if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

  const user = await getCurrentUser();

  if (!lesson.isFree) {
    if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });
    const enrolled = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: lesson.module.courseId } },
      select: { id: true },
    });
    if (!enrolled) {
      return NextResponse.json({ error: "This lesson opens after you buy the course." }, { status: 403 });
    }
  }

  // Free preview bina login ke bhi chalti hai — tab token anonymous user ka hota hai.
  const token = createVideoToken(lesson.id, user?.id ?? "guest");

  return NextResponse.json({
    url: `/api/video/stream?token=${encodeURIComponent(token)}`,
    expiresIn: VIDEO_TOKEN_TTL,
  });
}
