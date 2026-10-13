import { WhatsAppIcon } from "./icons";

const DEFAULT_MESSAGE =
  "Hi Sohail, mujhe course ke baare mein help chahiye";

export function WhatsAppButton({ number }: { number: string }) {
  const href = `https://wa.me/${number}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp support"
      className="fixed right-4 bottom-4 z-50 flex h-[54px] items-center gap-2.5 rounded-full bg-whatsapp pr-4.5 pl-3.5 text-[14.5px] font-bold text-white shadow-[0_8px_24px_rgba(16,18,30,.22)] transition-colors hover:bg-whatsapp-dark"
    >
      <WhatsAppIcon size={26} />
      <span className="hidden sm:inline">WhatsApp Support</span>
    </a>
  );
}
