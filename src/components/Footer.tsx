const LINKS = ["Privacy Policy", "Terms", "Refund Policy", "Contact"];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex w-full max-w-[1120px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 pt-5.5 pb-24 text-[13px] font-medium text-muted">
        <span>© {new Date().getFullYear()} Sohail YouTube Academy</span>
        <div className="flex flex-wrap gap-4.5">
          {LINKS.map((l) => (
            <a key={l} href="#" className="text-body hover:text-brand">
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
