"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function MarkCompleteButton({
  lessonId,
  initialDone,
  labels,
}: {
  lessonId: string;
  initialDone: boolean;
  labels: { done: string; todo: string };
}) {
  const router = useRouter();
  const [done, setDone] = useState(initialDone);
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    const next = !done;
    setBusy(true);
    setDone(next); // optimistic
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lessonId, completed: next }),
    });
    setBusy(false);
    if (!res.ok) {
      setDone(!next); // rollback
      return;
    }
    // Sidebar ka tick aur percentage server se refresh ho jaate hain.
    startTransition(() => router.refresh());
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy || pending}
      className={`flex-[1_1_200px] rounded-xl px-4.5 py-3.5 text-[14.5px] font-bold transition-colors disabled:opacity-70 ${
        done
          ? "border border-transparent bg-ok-soft text-ok"
          : "border border-ok bg-ok text-white hover:brightness-95"
      }`}
    >
      {done ? labels.done : labels.todo}
    </button>
  );
}
