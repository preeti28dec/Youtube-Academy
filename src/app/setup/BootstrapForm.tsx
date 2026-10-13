"use client";

import { useState } from "react";

const inputCls =
  "h-12 w-full rounded-[10px] border border-line-strong bg-surface px-3.5 text-[15px] font-medium text-ink placeholder:font-normal placeholder:text-muted";

/** Password browser mein banta hai — server ya kisi log se hokar nahi aata. */
function strongPassword(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*";
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export function BootstrapForm() {
  const [form, setForm] = useState({ name: "Sohail", email: "", mobile: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ password: string; modules: number; lessons: number } | null>(
    null,
  );

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setError(null);
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const password = strongPassword();
    try {
      const res = await fetch("/api/setup/bootstrap", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Setup nahi hua.");
      setDone({ password, modules: data.modules, lessons: data.lessons });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup nahi hua.");
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col gap-3.5 rounded-xl border border-ok bg-ok-soft p-4.5">
        <span className="text-[15px] font-bold text-ok">
          Ho gaya — {done.modules} modules, {done.lessons} lessons bann gaye.
        </span>
        <div className="flex flex-col gap-1.5 rounded-[10px] border border-line bg-surface p-3.5">
          <span className="text-[13px] font-semibold text-body">
            Admin password — <strong>abhi save kar lein</strong>, yeh dobara nahi dikhega
          </span>
          <span className="font-mono text-[17px] font-semibold break-all text-ink">
            {done.password}
          </span>
          <span className="text-[12.5px] text-muted">Login ID: {form.email}</span>
        </div>
        <a
          href="/"
          className="rounded-xl bg-brand px-5 py-3.5 text-center text-[15px] font-bold text-white hover:bg-brand-dark"
        >
          Site kholein
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3.5">
      <label className="flex flex-col gap-1.75">
        <span className="text-[13px] font-semibold text-body">Admin ka naam</span>
        <input value={form.name} onChange={set("name")} className={inputCls} />
      </label>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.75">
          <span className="text-[13px] font-semibold text-body">Admin email (login ID)</span>
          <input
            value={form.email}
            onChange={set("email")}
            type="email"
            placeholder="sohail@gmail.com"
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1.75">
          <span className="text-[13px] font-semibold text-body">Mobile (10 digit)</span>
          <input
            value={form.mobile}
            onChange={set("mobile")}
            inputMode="numeric"
            maxLength={10}
            placeholder="98XXXXXXXX"
            className={inputCls}
          />
        </label>
      </div>

      {error && (
        <span className="rounded-[10px] bg-danger-soft px-3.5 py-2.75 text-[13.5px] font-semibold text-danger">
          {error}
        </span>
      )}

      <button
        type="submit"
        disabled={busy}
        className="rounded-xl bg-brand px-5 py-4 text-base font-bold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {busy ? "Ban raha hai..." : "Course aur admin account banayein"}
      </button>
      <span className="text-[12.5px] leading-relaxed text-muted">
        Password apne aap bann kar aapko ek baar dikhaya jayega. Yeh button sirf tab tak kaam
        karta hai jab tak database bilkul khaali hai.
      </span>
    </form>
  );
}
