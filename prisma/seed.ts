import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/** [module title, [[lesson title, duration, isFree?], ...]] */
const SYLLABUS: [string, [string, string, boolean?][]][] = [
  [
    "YouTube Basics & Channel Setup",
    [
      ["Course introduction", "06:12", true],
      ["Channel ka niche kaise choose karein", "14:30"],
      ["Channel setup: name, logo, banner", "18:05"],
      ["YouTube Studio ka overview", "12:40"],
    ],
  ],
  [
    "Content Planning & Research",
    [
      ["Video ideas kaise dhundhein", "16:20"],
      ["Keyword research tools", "19:45"],
      ["Competitor analysis", "13:10"],
    ],
  ],
  [
    "Mobile se Shooting & Editing",
    [
      ["Mobile shooting setup", "15:00", true],
      ["Lighting aur audio basics", "11:35"],
      ["Mobile editing step-by-step", "24:50"],
      ["Shorts kaise banayein", "17:15"],
    ],
  ],
  [
    "Thumbnail, Title & SEO",
    [
      ["Click-worthy thumbnails", "20:10"],
      ["Title aur description likhna", "14:25"],
      ["Tags, hashtags aur chapters", "10:55"],
    ],
  ],
  [
    "Growth & Audience",
    [
      ["Upload schedule aur consistency", "09:40"],
      ["YouTube Analytics samjhein", "21:30"],
      ["Comments aur community se judna", "08:50"],
    ],
  ],
  [
    "Monetization",
    [
      ["YPP eligibility aur apply karna", "13:20"],
      ["Sponsorship aur brand deals", "16:45"],
      ["Affiliate income", "12:05"],
    ],
  ],
];

/** Demo students — admin panel ki list bhari dikhe. */
const DEMO_STUDENTS: [string, string, string, number][] = [
  ["Rahul Sharma", "rahul.sharma@gmail.com", "9829041122", 72],
  ["Pooja Verma", "pooja.v@gmail.com", "9716033018", 45],
  ["Imran Khan", "imrankhan.yt@gmail.com", "9983067251", 100],
  ["Neha Gupta", "nehagupta21@yahoo.com", "8875012094", 18],
  ["Arjun Patel", "arjunpatel@gmail.com", "9099055873", 60],
  ["Sana Ansari", "sana.ansari@gmail.com", "7021088463", 5],
];

function toSeconds(mmss: string): number {
  const [m, s] = mmss.split(":").map((n) => parseInt(n, 10) || 0);
  return m * 60 + s;
}

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

  const course = await prisma.course.create({
    data: {
      slug: "youtube-growth-masterclass",
      title: "YouTube Growth Masterclass",
      subtitle: "Hindi mein · Mobile-friendly · Lifetime access",
      description:
        "Yeh course un logon ke liye hai jo YouTube channel shuru karna chahte hain ya apne existing channel ko grow karna chahte hain. Saari videos Hindi mein hain aur mobile par aaram se dekhi ja sakti hain. Course ke end tak aap khud video plan, shoot, edit aur publish kar payenge.",
      pricePaise: 149900,
    },
  });

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
