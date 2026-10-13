import Link from "next/link";

/** Page ke aakhir mein aakhri dhakka — Figma ke "Ready to be seen?" jaisa. */
export function FinalCta({ price }: { price: string }) {
  return (
    <section className="bg-ink">
      <div className="mx-auto flex w-full max-w-[1120px] flex-wrap items-center justify-between gap-6 px-5 py-14">
        <div className="flex flex-col gap-2">
          <h2 className="text-[clamp(24px,3.4vw,32px)] font-extrabold leading-tight tracking-[-0.02em] text-white">
            Taiyaar hain shuru karne ke liye?
          </h2>
          <p className="text-[15px] leading-relaxed text-onDark">
            Ek baar payment, lifetime access. Aaj hi apna channel shuru karein.
          </p>
        </div>
        <Link
          href="/checkout"
          className="rounded-xl bg-brand px-6.5 py-4 text-base font-bold text-white transition-colors hover:bg-brand-dark"
        >
          Enroll Now · ₹{price}
        </Link>
      </div>
    </section>
  );
}
