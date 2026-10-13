import Link from "next/link";
import { getDictionary } from "@/i18n";

export const metadata = { title: "Page not found · Sohail YouTube Academy" };

export default function NotFound() {
  const d = getDictionary().notFound;

  return (
    <div className="mx-auto w-full max-w-[520px] px-5 pt-20 pb-24">
      <div className="flex flex-col items-center gap-4 rounded-[18px] border border-line bg-surface p-[clamp(24px,5vw,40px)] text-center shadow-[0_4px_16px_rgba(20,24,33,.06)]">
        <span className="font-mono text-[13px] font-semibold tracking-[0.09em] text-faint">404</span>
        <h1 className="text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-ink">
          {d.title}
        </h1>
        <p className="text-[15px] leading-relaxed text-body">
          {d.lead}
        </p>
        <div className="flex flex-wrap justify-center gap-2.5 pt-1">
          <Link
            href="/"
            className="rounded-xl bg-brand px-5 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-brand-dark"
          >
            {d.home}
          </Link>
          <Link
            href="/course"
            className="rounded-xl border border-line-strong bg-surface px-5 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:bg-[#f7f8fa]"
          >
            {d.seeCourse}
          </Link>
        </div>
      </div>
    </div>
  );
}
