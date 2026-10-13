"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const inputCls =
  "h-11 w-full rounded-[10px] border border-line-strong bg-surface px-3 text-sm font-medium text-ink";

/**
 * Course ki apni jaankari — title, subtitle, description, price.
 *
 * Modules aur lessons alag se manage hote hain; yeh wahi cheezein badalta hai
 * jinke liye pehle developer ki zaroorat padti thi.
 */
export function CourseInfoForm({
  initial,
}: {
  initial: { title: string; subtitle: string; description: string; priceRupees: number };
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty =
    form.title !== initial.title ||
    form.subtitle !== initial.subtitle ||
    form.description !== initial.description ||
    form.priceRupees !== initial.priceRupees;

  async function save() {
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/course", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not save.");
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-[14px] border border-line bg-surface p-4.5">
      <span className="text-[15px] font-bold text-ink">Course information</span>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-semibold text-body">Course title</span>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={inputCls}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-semibold text-body">Short tagline</span>
        <input
          value={form.subtitle}
          onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          className={inputCls}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-semibold text-body">Description</span>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={5}
          className="w-full rounded-[10px] border border-line-strong bg-surface p-3 text-sm leading-relaxed font-medium text-ink"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-semibold text-body">Price (₹)</span>
        <input
          value={form.priceRupees}
          onChange={(e) => setForm({ ...form, priceRupees: Number(e.target.value) || 0 })}
          inputMode="numeric"
          className={inputCls}
        />
      </label>

      {error && (
        <span className="rounded-[10px] bg-danger-soft px-3 py-2.5 text-[13px] font-semibold text-danger">
          {error}
        </span>
      )}
      {saved && !dirty && (
        <span className="rounded-[10px] bg-ok-soft px-3 py-2.5 text-[13px] font-semibold text-ok">
          Saved.
        </span>
      )}

      <button
        type="button"
        onClick={save}
        disabled={busy || !dirty}
        className="rounded-[10px] bg-brand px-4 py-3.25 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {busy ? "Saving..." : "Save course info"}
      </button>
    </div>
  );
}
