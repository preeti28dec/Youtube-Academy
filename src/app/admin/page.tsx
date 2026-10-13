import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCourse } from "@/lib/course";
import { getCurrentUser } from "@/lib/auth";
import { formatMobile } from "@/lib/format";
import { AdminContent } from "./AdminContent";
import { CourseInfoForm } from "./CourseInfoForm";
import { LogoutButton } from "@/components/LogoutButton";
import { getDictionary, t } from "@/i18n";

export const metadata = { title: "Admin · Sohail YouTube Academy" };

const TAB_IDS = ["content", "students"] as const;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  // Admin ke alawa koi yahan na pahunche.
  if (user.role !== "admin") redirect("/dashboard");

  const dict = getDictionary();
  const a = dict.admin;
  const { tab, q } = await searchParams;
  const activeTab = tab === "students" ? "students" : "content";
  const search = (q ?? "").trim();

  const course = await getCourse();
  if (!course) notFound();

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [totalStudents, thisMonth] = await Promise.all([
    prisma.enrollment.count({ where: { courseId: course.id } }),
    prisma.enrollment.count({ where: { courseId: course.id, createdAt: { gte: monthStart } } }),
  ]);

  const stats = [
    { label: a.stats.totalStudents, value: String(totalStudents) },
    { label: a.stats.thisMonth, value: String(thisMonth) },
    { label: a.stats.modules, value: String(course.moduleCount) },
    { label: a.stats.lessons, value: String(course.lessonCount) },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-5 px-5 pt-8 pb-18">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold tracking-[0.09em] uppercase text-faint">
            {a.eyebrow}
          </span>
          <h1 className="text-[clamp(24px,3.4vw,30px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-ink">
            {a.title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 rounded-[11px] bg-fill p-1">
            {TAB_IDS.map((id) => {
              const on = activeTab === id;
              return (
                <Link
                  key={id}
                  href={`/admin?tab=${id}`}
                  className={`rounded-lg px-4 py-2.5 text-[13.5px] font-semibold ${
                    on
                      ? "bg-surface text-ink shadow-[0_1px_2px_rgba(20,24,33,.08)]"
                      : "text-body hover:text-ink"
                  }`}
                >
                  {a.tabs[id]}
                </Link>
              );
            })}
          </div>
          <LogoutButton label={dict.nav.logout} />
        </div>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-[14px] border border-line bg-surface px-5 py-4.5 shadow-[0_1px_2px_rgba(20,24,33,.05)]"
          >
            <div className="text-[10.5px] font-semibold tracking-[0.09em] uppercase text-faint">
              {s.label}
            </div>
            <div className="mt-2.75 text-[28px] font-extrabold tracking-[-0.02em] text-ink">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {activeTab === "content" ? (
        <div className="flex flex-col gap-5">
          <CourseInfoForm
            initial={{
              title: course.title,
              subtitle: course.subtitle,
              description: course.description,
              priceRupees: Math.round(course.pricePaise / 100),
            }}
          />
          <AdminContent modules={course.modules} t={a} />
        </div>
      ) : (
        <StudentsTable courseId={course.id} search={search} t={a} />
      )}
    </div>
  );
}

async function StudentsTable({
  courseId,
  search,
  t: a,
}: {
  courseId: string;
  search: string;
  t: ReturnType<typeof getDictionary>["admin"];
}) {
  const totalLessons = await prisma.lesson.count({ where: { module: { courseId } } });

  const enrollments = await prisma.enrollment.findMany({
    where: {
      courseId,
      ...(search
        ? {
            user: {
              OR: [
                { name: { contains: search } },
                { email: { contains: search } },
                { mobile: { contains: search } },
              ],
            },
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          mobile: true,
          _count: { select: { progress: { where: { completed: true } } } },
        },
      },
    },
  });

  const rows = enrollments.map((e) => ({
    id: e.user.id,
    name: e.user.name,
    email: e.user.email,
    mobile: formatMobile(e.user.mobile),
    date: e.createdAt.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    pct: totalLessons ? Math.round((e.user._count.progress / totalLessons) * 100) : 0,
  }));

  return (
    <div className="overflow-hidden rounded-[14px] border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-line px-4.5 py-3.5">
        <span className="text-[15px] font-bold text-ink">{a.students}</span>
        {/* GET form — search URL mein rehta hai, isliye link share/bookmark ho sakta hai. */}
        <form method="GET" action="/admin" className="flex min-w-0 flex-[0_1_320px] gap-2">
          <input type="hidden" name="tab" value="students" />
          <input
            name="q"
            defaultValue={search}
            placeholder={a.searchPlaceholder}
            className="h-10 min-w-0 flex-1 rounded-[9px] border border-line-strong bg-surface px-3 text-[13.5px] font-medium"
          />
          <button
            type="submit"
            className="rounded-[9px] border border-line-strong bg-surface px-3 text-[13px] font-semibold text-body hover:bg-[#f7f8fa]"
          >
            {a.search}
          </button>
        </form>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[1.3fr_1fr_1.6fr_0.9fr_1.2fr] gap-3 border-b border-line bg-surface-muted px-4.5 py-2.75 text-[10.5px] font-semibold tracking-[0.09em] uppercase text-faint">
            <span>{a.table.name}</span>
            <span>{a.table.mobile}</span>
            <span>{a.table.email}</span>
            <span>{a.table.enrolled}</span>
            <span>{a.table.progress}</span>
          </div>

          {rows.map((s) => (
            <div
              key={s.id}
              className="grid grid-cols-[1.3fr_1fr_1.6fr_0.9fr_1.2fr] items-center gap-3 border-b border-line-soft px-4.5 py-3.25 text-[13.5px] font-medium leading-snug text-ink"
            >
              <span className="font-semibold">{s.name}</span>
              <span className="font-mono text-[12.5px] text-body">{s.mobile}</span>
              <span className="overflow-hidden text-ellipsis text-body">{s.email}</span>
              <span className="text-body">{s.date}</span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-fill">
                  <span className="block h-full bg-ok" style={{ width: `${s.pct}%` }} />
                </span>
                <span className="w-8.5 text-right text-xs font-bold">{s.pct}%</span>
              </span>
            </div>
          ))}

          {rows.length === 0 && (
            <p className="px-4.5 py-6 text-sm text-muted">
              {search ? t(a.noStudentsSearch, { q: search }) : a.noStudents}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
