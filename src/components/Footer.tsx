import { getDictionary } from "@/i18n";

export function Footer() {
  const d = getDictionary();
  const links = [d.footer.privacy, d.footer.terms, d.footer.refund, d.footer.contact];

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex w-full max-w-[1120px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 pt-5.5 pb-24 text-[13px] font-medium text-muted">
        <span>
          © {new Date().getFullYear()} {d.footer.rights}
        </span>
        <div className="flex flex-wrap gap-4.5">
          {links.map((l) => (
            <a key={l} href="#" className="text-body hover:text-brand">
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
