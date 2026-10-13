"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const inputCls =
  "h-12 w-full rounded-[10px] border border-line-strong bg-surface px-3.5 text-[15px] font-medium text-ink placeholder:font-normal placeholder:text-muted";

export function LoginForm() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login nahi hua.");
      // refresh() se layout ka server-side user state bhi update ho jaata hai.
      router.push(data.redirect ?? "/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login nahi hua.");
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-4.5 rounded-[18px] border border-line bg-surface p-[clamp(24px,5vw,36px)] shadow-[0_4px_16px_rgba(20,24,33,.06)]"
    >
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-ink">
          Student login
        </h1>
        <span className="text-[14.5px] leading-normal text-body">
          Apne course tak pahunchne ke liye login karein.
        </span>
      </div>

      <label className="flex flex-col gap-1.75">
        <span className="text-[13px] font-semibold text-body">Email ya mobile number</span>
        <input
          value={id}
          onChange={(e) => {
            setId(e.target.value);
            setError(null);
          }}
          autoComplete="username"
          placeholder="aap@gmail.com / 98XXXXXXXX"
          className={inputCls}
        />
      </label>

      <label className="flex flex-col gap-1.75">
        <span className="flex justify-between text-[13px] font-semibold text-body">
          <span>Password</span>
          <Link href="/login" className="font-semibold text-brand">
            Password bhool gaye?
          </Link>
        </span>
        <input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className={inputCls}
        />
      </label>

      {error && (
        <span className="rounded-[10px] bg-danger-soft px-3.5 py-2.75 text-[13.5px] font-semibold leading-snug text-danger">
          {error}
        </span>
      )}

      <button
        type="submit"
        disabled={busy}
        className="rounded-xl bg-brand px-5.5 py-4 text-base font-bold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Login ho raha hai..." : "Login"}
      </button>

      <span className="text-center text-[13.5px] font-medium leading-normal text-body">
        Abhi tak course nahi liya?{" "}
        <Link href="/checkout" className="font-semibold text-brand">
          Enroll karein
        </Link>
      </span>
    </form>
  );
}
