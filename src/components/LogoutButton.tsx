"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
      }}
      className="rounded-[10px] border border-line-strong bg-surface px-3.5 py-2.5 text-[13.5px] font-semibold text-body transition-colors hover:bg-[#f7f8fa] disabled:opacity-60"
    >
      Logout
    </button>
  );
}
