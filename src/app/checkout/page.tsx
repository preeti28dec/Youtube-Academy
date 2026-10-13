import { notFound, redirect } from "next/navigation";
import { getCourse } from "@/lib/course";
import { rupees } from "@/lib/format";
import { getCurrentUser, isEnrolled } from "@/lib/auth";
import { getDictionary, t } from "@/i18n";
import { CheckoutForm } from "./CheckoutForm";
import { PlayIcon } from "@/components/icons";

export const metadata = { title: "Checkout · Sohail YouTube Academy" };

export default async function CheckoutPage() {
  const course = await getCourse();
  if (!course) notFound();

  // Pehle se enrolled student ko dobara pay karne ki zaroorat nahi.
  const user = await getCurrentUser();
  if (user && (await isEnrolled(user.id, course.id))) redirect("/dashboard");

  const price = rupees(course.pricePaise);
  const d = getDictionary();
  const c = d.checkout;

  return (
    <div className="mx-auto flex w-full max-w-[980px] flex-wrap-reverse items-start gap-6 px-5 pt-10 pb-18">
      <CheckoutForm price={price} t={c} />

      <aside className="flex flex-[1_1_280px] flex-col gap-3.5 rounded-2xl border border-line bg-surface p-5.5">
        <span className="text-[11px] font-semibold tracking-[0.09em] uppercase text-faint">
          {c.orderSummary}
        </span>
        <div className="flex items-center gap-3">
          <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-[10px] bg-ink text-white">
            <PlayIcon size={18} />
          </span>
          <span className="flex flex-col gap-1.25">
            <span className="text-[15px] font-bold leading-tight text-ink">{course.title}</span>
            <span className="text-[12.5px] font-medium text-muted">
              {t(c.lessonsLifetime, { count: course.lessonCount })}
            </span>
          </span>
        </div>
        <div className="flex flex-col gap-2.5 border-t border-line pt-3.5 text-sm font-medium text-body">
          <div className="flex justify-between">
            <span>{c.courseFee}</span>
            <span>₹{price}</span>
          </div>
          <div className="flex justify-between pt-1 text-[17px] font-extrabold text-ink">
            <span>{c.total}</span>
            <span>₹{price}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
