import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { COURSE, SYLLABUS, toSeconds } from "../src/lib/starter-content";

const prisma = new PrismaClient();

/** Demo students — admin panel ki list bhari dikhe. */
const DEMO_STUDENTS: [string, string, string, number][] = [
  ["Rahul Sharma", "rahul.sharma@gmail.com", "9829041122", 72],
  ["Pooja Verma", "pooja.v@gmail.com", "9716033018", 45],
  ["Imran Khan", "imrankhan.yt@gmail.com", "9983067251", 100],
  ["Neha Gupta", "nehagupta21@yahoo.com", "8875012094", 18],
  ["Arjun Patel", "arjunpatel@gmail.com", "9099055873", 60],
  ["Sana Ansari", "sana.ansari@gmail.com", "7021088463", 5],
];

async function main() {
  console.log("Seeding...");

  // Idempotent: dobara chalane par duplicate na bane.
  await prisma.progress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

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
            // Local demo: sample.mp4 ko media/ folder mein daalein to har lesson chalega.
            videoKey: "sample.mp4",
          })),
        },
      },
    });
  }

  const admin = await prisma.user.create({
    data: {
      name: "Sohail",
      email: "admin@sya.test",
      mobile: "9000000001",
      passwordHash: await bcrypt.hash("admin123", 10),
      role: "admin",
    },
  });

  const allLessons = await prisma.lesson.findMany({
    orderBy: [{ module: { position: "asc" } }, { position: "asc" }],
    select: { id: true },
  });

  for (const [name, email, mobile, pct] of DEMO_STUDENTS) {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        passwordHash: await bcrypt.hash("student123", 10),
        role: "student",
      },
    });
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        courseId: course.id,
        amountPaise: course.pricePaise,
        status: "paid",
        method: "upi",
        gatewayOrderId: `seed_${user.id}`,
        paidAt: new Date(),
      },
    });
    await prisma.enrollment.create({
      data: { userId: user.id, courseId: course.id, orderId: order.id },
    });

    const doneCount = Math.round((pct / 100) * allLessons.length);
    for (const lesson of allLessons.slice(0, doneCount)) {
      await prisma.progress.create({
        data: { userId: user.id, lessonId: lesson.id, completed: true, completedAt: new Date() },
      });
    }
  }

  console.log(`
Seed complete.

  Course   : ${course.title}  (${allLessons.length} lessons)
  Admin    : admin@sya.test / admin123        -> /admin
  Student  : rahul.sharma@gmail.com / student123  -> /dashboard
`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
