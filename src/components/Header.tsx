"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MenuIcon, PlayIcon } from "./icons";
import type { SessionUser } from "@/lib/auth";

type NavItem = { href: string; label: string };

export function Header({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Home par anchors (woh saare sections wahin hain); baaki pages par
  // seedha /course ka link, kyunki anchor sirf landing par kaam karega.
  const onHome = pathname === "/";
  const nav: NavItem[] = onHome
    ? [
        { href: "#course", label: "Course" },
        { href: "#curriculum", label: "Curriculum" },
        { href: "#mentor", label: "Mentor" },
        { href: "#faqs", label: "FAQs" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/course", label: "Course Details" },
      ];

  nav.push(user ? { href: "/dashboard", label: "My Course" } : { href: "/login", label: "Login" });
  if (user?.role === "admin") nav.push({ href: "/admin", label: "Admin" });

  const cta = user
    ? { href: "/dashboard", label: "My Course" }
    : { href: "/checkout", label: "Enroll Now" };

  const linkColor = (href: string) =>
    pathname === href ? "text-brand" : "text-body hover:text-brand";

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface">
      <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between gap-4 px-5">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-brand text-white">
            <PlayIcon size={16} />
          </span>
          <span className="flex flex-col items-start gap-[3px]">
            <span className="text-[15px] font-extrabold tracking-[-0.01em] text-ink">
              Sohail YouTube Academy
            </span>
            <span className="text-[11px] font-medium text-muted">Learn. Create. Grow.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1.5 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-[9px] px-3 py-2.5 text-sm font-semibold ${linkColor(n.href)}`}
            >
              {n.label}
            </Link>
          ))}
          <Link
            href={cta.href}
            className="ml-2 rounded-[10px] bg-brand px-4.5 py-2.75 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(33,38,82,.22)] transition-colors hover:bg-brand-dark"
          >
            {cta.label}
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-line-strong bg-surface text-ink md:hidden"
        >
          <MenuIcon size={20} />
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-line bg-surface px-5 pt-2.5 pb-4.5 md:hidden">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={`border-b border-[#f0f1f3] px-1 py-3.5 text-[15px] font-semibold ${linkColor(n.href)}`}
            >
              {n.label}
            </Link>
          ))}
          <Link
            href={cta.href}
            onClick={() => setOpen(false)}
            className="mt-2.5 rounded-[10px] bg-brand px-4.5 py-3.75 text-center text-[15px] font-semibold text-white"
          >
            {cta.label}
          </Link>
        </div>
      )}
    </header>
  );
}
