import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatMobile } from "@/lib/format";
import { CheckIcon } from "@/components/icons";

export const metadata = { title: "Payment successful · Sohail YouTube Academy" };

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Order dikhane se pehle check: yeh order isi logged-in student ka hai?
  const order = orderId
    ? await prisma.order.findFirst({
        where: { id: orderId, userId: user.id, status: "paid" },
        select: { id: true },
      })
    : null;

  // Verify route ne pehla password one-time cookie mein rakha tha.
  // Padh ke turant delete — refresh par dobara nahi dikhega.
  const jar = await cookies();
  const tempPassword = jar.get("sya_welcome_pw")?.value ?? null;
  if (tempPassword) jar.delete("sya_welcome_pw");

  return (
    <div className="mx-auto w-full max-w-[560px] px-5 pt-14 pb-20">
      <div className="flex flex-col items-center gap-4 rounded-[18px] border border-line bg-surface p-[clamp(24px,5vw,40px)] text-center shadow-[0_4px_16px_rgba(20,24,33,.06)]">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ok-soft text-ok">
          <CheckIcon size={30} strokeWidth={2.6} />
        </span>
        <h1 className="text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-ink">
          Payment successful!
        </h1>
        <p className="text-[15px] leading-relaxed text-body">
          Welcome {user.name.split(" ")[0]}. Aapka student account ban gaya hai aur course unlock ho
          gaya hai.
        </p>

        <dl className="flex w-full flex-col gap-2.5 rounded-xl border border-line bg-surface-muted p-4 text-left text-sm font-medium">
          <div className="flex flex-wrap justify-between gap-3">
            <dt className="text-muted">Login ID</dt>
            <dd className="font-semibold text-ink">{user.email}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-3">
            <dt className="text-muted">Mobile</dt>
            <dd className="font-semibold text-ink">+91 {formatMobile(user.mobile)}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-3">
            <dt className="text-muted">Order ID</dt>
            <dd className="font-mono text-[13px]">{order ? order.id : "—"}</dd>
          </div>
        </dl>

        {tempPassword ? (
          <div className="flex w-full flex-col gap-1.5 rounded-xl border border-brand bg-brand-soft p-4 text-left">
            <span className="text-[13px] font-semibold text-brand-dark">
              Aapka pehla password — ise save kar lein
            </span>
            <span className="font-mono text-[17px] font-semibold text-ink">{tempPassword}</span>
            <span className="text-[12.5px] leading-snug text-body">
              Yahi password email aur WhatsApp par bhi bheja gaya hai. Login karke ise badal lein.
            </span>
          </div>
        ) : (
          <span className="text-[13.5px] leading-normal text-body">
            Password set karne ka link aapke email aur WhatsApp par bhej diya gaya hai.
          </span>
        )}

        <Link
          href="/dashboard"
          className="w-full rounded-xl bg-brand px-5.5 py-4 text-base font-bold text-white transition-colors hover:bg-brand-dark"
        >
          Course shuru karein
        </Link>
      </div>
    </div>
  );
}
