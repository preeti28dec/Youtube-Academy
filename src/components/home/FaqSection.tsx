import { FAQS } from "@/lib/site-content";
import { env } from "@/lib/env";
import { WhatsAppIcon } from "@/components/icons";

/**
 * Native <details> — koi client JS nahi, aur JS band hone par bhi
 * saare jawab padhe ja sakte hain (search engines ke liye bhi achha).
 */
export function FaqSection() {
  const wa = `https://wa.me/${env.whatsappNumber}?text=${encodeURIComponent(
    "Hi Sohail, mujhe course ke baare mein ek sawaal poochna hai",
  )}`;

  return (
    <section id="faqs" className="scroll-mt-20 border-t border-line bg-surface">
      <div className="mx-auto flex w-full max-w-[1120px] flex-wrap items-start gap-x-12 gap-y-8 px-5 pt-16 pb-18">
        <div className="flex flex-[1_1_280px] flex-col gap-4">
          <span className="self-start rounded-full bg-brand-soft px-3 py-1.5 text-[11px] font-semibold tracking-[0.09em] uppercase text-brand">
            Sawaal hain?
          </span>
          <h2 className="text-[clamp(26px,4vw,38px)] font-extrabold leading-[1.12] tracking-[-0.025em] text-ink">
            Aap poochhiye.
            <br />
            Hum batate hain.
          </h2>
          <p className="max-w-[360px] text-[15.5px] leading-relaxed text-body">
            Koi aur sawaal ho to seedha WhatsApp par pooch lijiye — jawab wahin mil jayega.
          </p>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 self-start rounded-xl bg-whatsapp px-4.5 py-3.25 text-[14.5px] font-bold text-white transition-colors hover:bg-whatsapp-dark"
          >
            <WhatsAppIcon size={18} />
            WhatsApp par poochein
          </a>
        </div>

        <div className="min-w-0 flex-[999_1_520px]">
          {FAQS.map((f, i) => (
            <details
              key={f.q}
              open={i === 0}
              className="group border-b border-line last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center gap-4 py-4.5 [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 flex-1 text-[16px] font-bold leading-snug text-ink">
                  {f.q}
                </span>
                {/* + se × — group-open par ek line ghoom jaati hai */}
                <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line-strong text-muted transition-colors group-open:border-transparent group-open:bg-ink group-open:text-white">
                  <span className="absolute h-[1.5px] w-3 rounded bg-current" />
                  <span className="absolute h-[1.5px] w-3 rotate-90 rounded bg-current transition-transform group-open:rotate-0" />
                </span>
              </summary>
              <p className="pr-11 pb-5 text-[14.5px] leading-relaxed text-body">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
