import { prisma } from "./prisma";
import { humanDuration } from "./format";

/** Site ek hi course bechti hai — yahi uska slug hai. */
export const COURSE_SLUG = "youtube-growth-masterclass";

export type LessonRow = {
  id: string;
  title: string;
  duration: string;
  durationSec: number;
  isFree: boolean;
  position: number;
};

export type ModuleRow = {
  id: string;
  title: string;
  position: number;
  lessons: LessonRow[];
};

export type CourseData = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  pricePaise: number;
  modules: ModuleRow[];
  lessonCount: number;
  moduleCount: number;
  totalDuration: string;
};

/** Course + poora syllabus, sahi order mein. */
export async function getCourse(): Promise<CourseData | null> {
  const course = await prisma.course.findUnique({
    where: { slug: COURSE_SLUG },
    include: {
      modules: {
        orderBy: { position: "asc" },
        include: { lessons: { orderBy: { position: "asc" } } },
      },
    },
  });
  if (!course) return null;

  const lessons = course.modules.flatMap((m) => m.lessons);
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    pricePaise: course.pricePaise,
    modules: course.modules.map((m) => ({
      id: m.id,
      title: m.title,
      position: m.position,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        duration: l.duration,
        durationSec: l.durationSec,
        isFree: l.isFree,
        position: l.position,
      })),
    })),
    lessonCount: lessons.length,
    moduleCount: course.modules.length,
    totalDuration: humanDuration(lessons.reduce((a, l) => a + l.durationSec, 0)),
  };
}

/** Lesson ids ka flat set jo student ne complete kiya hai. */
export async function getCompletedLessonIds(userId: string): Promise<Set<string>> {
  const rows = await prisma.progress.findMany({
    where: { userId, completed: true },
    select: { lessonId: true },
  });
  return new Set(rows.map((r) => r.lessonId));
}

export function moduleDuration(m: ModuleRow): string {
  return humanDuration(m.lessons.reduce((a, l) => a + l.durationSec, 0));
}
