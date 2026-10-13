"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldIcon } from "@/components/icons";
import { type Dictionary, t as fmt } from "@/i18n";

type Method = "upi" | "card" | "netbanking";

const METHOD_IDS: Method[] = ["upi", "card", "netbanking"];

const BANKS = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
];

const inputCls =
  "h-12 w-full rounded-[10px] border border-line-strong bg-surface px-3.5 text-[15px] font-medium text-ink placeholder:font-normal placeholder:text-muted";

export function CheckoutForm({ price, t }: { price: string; t: Dictionary["checkout"] }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", mobile: "", email: "" });
  const [method, setMethod] = useState<Method>("upi");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setError(null);
  };

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      // 1. Server par order banao — details wahin validate hoti hain.
      const orderRes = await fetch("/api/payment/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, method }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.error ?? t.errors.orderFailed);

      // 2. Live keys hon to Razorpay checkout kholo, warna demo mode.
      const payment = order.live
        ? await openRazorpay(order, form)
        : { paymentId: `demo_pay_${Date.now()}`, signature: "demo" };

      if (!payment) {
        setBusy(false);
        return; // student ne checkout band kar diya
      }

      // 3. Verify -> account create + course unlock + login.
      const verifyRes = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ gatewayOrderId: order.gatewayOrderId, ...payment }),
      });
      const verified = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verified.error ?? t.errors.verifyFailed);

      router.push(`/checkout/success?order=${encodeURIComponent(verified.orderId)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.generic);
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={pay}
      className="flex min-w-0 flex-[999_1_520px] flex-col gap-5.5 rounded-2xl border border-line bg-surface p-[clamp(20px,3.5vw,32px)] shadow-[0_1px_2px_rgba(20,24,33,.05)]"
    >
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-ink">
          {t.title}
        </h1>
        <span className="text-[14.5px] leading-normal text-body">
          {t.lead}
        </span>
      </div>

      <div className="flex flex-col gap-3.5">
        <label className="flex flex-col gap-1.75">
          <span className="text-[13px] font-semibold text-body">{t.fullName}</span>
          <input
            value={form.name}
            onChange={set("name")}
            placeholder={t.namePlaceholder}
            autoComplete="name"
            className={inputCls}
          />
        </label>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.75">
            <span className="text-[13px] font-semibold text-body">{t.mobile}</span>
            <div className="flex h-12 overflow-hidden rounded-[10px] border border-line-strong focus-within:border-brand focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)]">
              <span className="flex items-center border-r border-line bg-surface-muted px-3 text-sm font-semibold text-body">
                +91
              </span>
              <input
                value={form.mobile}
                onChange={set("mobile")}
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel"
                placeholder={t.mobilePlaceholder}
                className="min-w-0 flex-1 px-3 text-[15px] font-medium outline-none focus-visible:shadow-none"
              />
            </div>
          </label>
          <label className="flex flex-col gap-1.75">
            <span className="text-[13px] font-semibold text-body">{t.email}</span>
            <input
              value={form.email}
              onChange={set("email")}
              type="email"
              autoComplete="email"
              placeholder={t.emailPlaceholder}
              className={inputCls}
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <span className="text-[15px] font-bold text-ink">{t.paymentMethod}</span>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {METHOD_IDS.map((id) => {
            const m = { id, ...t.methods[id] };
            const on = method === id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                aria-pressed={on}
                className={`flex min-h-17 flex-col gap-1.5 rounded-xl p-3.5 text-left ${
                  on
                    ? "border-[1.5px] border-brand bg-brand-soft"
                    : "border border-line-strong bg-surface"
                }`}
              >
                <span className="text-[14.5px] font-bold text-ink">{m.label}</span>
                <span className="text-xs leading-snug text-muted">{m.sub}</span>
              </button>
            );
          })}
        </div>

        {method === "upi" && (
          <div className="flex flex-col gap-2.5 rounded-xl border border-line bg-surface-muted p-4">
            <span className="text-[13.5px] leading-relaxed text-body">
              {t.upiNote}
            </span>
            <input
              placeholder={t.upiPlaceholder}
              className="h-11.5 rounded-[10px] border border-line-strong bg-surface px-3.5 text-[14.5px] font-medium"
            />
          </div>
        )}

        {method === "card" && (
          <div className="grid gap-2.5 rounded-xl border border-line bg-surface-muted p-4 sm:grid-cols-2">
            <input
              placeholder={t.cardNumber}
              inputMode="numeric"
              className="h-11.5 rounded-[10px] border border-line-strong bg-surface px-3.5 text-[14.5px] font-medium sm:col-span-2"
            />
            <input
              placeholder={t.cardExpiry}
              className="h-11.5 rounded-[10px] border border-line-strong bg-surface px-3.5 text-[14.5px] font-medium"
            />
            <input
              placeholder={t.cardCvv}
              inputMode="numeric"
              className="h-11.5 rounded-[10px] border border-line-strong bg-surface px-3.5 text-[14.5px] font-medium"
            />
          </div>
        )}

        {method === "netbanking" && (
          <div className="rounded-xl border border-line bg-surface-muted p-4">
            <select
              defaultValue=""
              className="h-11.5 w-full rounded-[10px] border border-line-strong bg-surface px-3 text-[14.5px] font-medium text-ink"
            >
              <option value="">{t.chooseBank}</option>
              {BANKS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && (
        <span className="rounded-[10px] bg-danger-soft px-3.5 py-2.75 text-[13.5px] font-semibold leading-snug text-danger">
          {error}
        </span>
      )}

      <button
        type="submit"
        disabled={busy}
        className="rounded-xl bg-brand px-5.5 py-4.25 text-base font-bold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? t.processing : fmt(t.payButton, { price })}
      </button>

      <span className="flex items-center justify-center gap-2 text-center text-[12.5px] font-medium leading-snug text-muted">
        <ShieldIcon size={14} className="shrink-0" />
        {t.secureNote}
      </span>
    </form>
  );
}

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayCtor = new (options: Record<string, unknown>) => { open: () => void };

/** Razorpay checkout script on-demand load karke modal kholta hai. */
async function openRazorpay(
  order: { gatewayOrderId: string; amountPaise: number; keyId: string; courseTitle: string },
  form: { name: string; mobile: string; email: string },
): Promise<{ paymentId: string; signature: string } | null> {
  await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  const Razorpay = (window as unknown as { Razorpay?: RazorpayCtor }).Razorpay;
  if (!Razorpay) throw new Error("The payment gateway did not load. Please check your connection.");

  return new Promise((resolve) => {
    new Razorpay({
      key: order.keyId,
      amount: order.amountPaise,
      currency: "INR",
      name: "Sohail YouTube Academy",
      description: order.courseTitle,
      order_id: order.gatewayOrderId,
      prefill: { name: form.name, email: form.email, contact: form.mobile },
      theme: { color: "#4f56e3" },
      handler: (res: RazorpayResponse) =>
        resolve({ paymentId: res.razorpay_payment_id, signature: res.razorpay_signature }),
      modal: { ondismiss: () => resolve(null) },
    }).open();
  });
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Script load failed"));
    document.head.appendChild(s);
  });
}
