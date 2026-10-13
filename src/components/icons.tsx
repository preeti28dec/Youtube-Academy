import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 18, ...rest }: P) {
  return { width: size, height: size, viewBox: "0 0 24 24", ...rest };
}

export function PlayIcon(p: P) {
  return (
    <svg {...base(p)} fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function CheckIcon(p: P) {
  return (
    <svg
      {...base(p)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function LockIcon(p: P) {
  return (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function ShieldIcon(p: P) {
  return (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 2 4 5v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3z" />
    </svg>
  );
}

export function ChevronDownIcon(p: P) {
  return (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ArrowLeftIcon(p: P) {
  return (
    <svg
      {...base(p)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function MenuIcon(p: P) {
  return (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

export function TrashIcon(p: P) {
  return (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
    </svg>
  );
}

export function PencilIcon(p: P) {
  return (
    <svg
      {...base(p)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}

export function UploadIcon(p: P) {
  return (
    <svg
      {...base(p)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 16V4M7 9l5-5 5 5M5 20h14" />
    </svg>
  );
}

export function VideoIcon(p: P) {
  return (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" />
    </svg>
  );
}

export function WhatsAppIcon(p: P) {
  return (
    <svg {...base(p)} fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.9 9.9 0 0 0 12.04 2zm5.8 14.03c-.25.69-1.43 1.32-1.98 1.37-.5.05-.98.23-3.3-.69-2.8-1.1-4.56-3.97-4.7-4.15-.14-.18-1.12-1.49-1.12-2.85 0-1.35.71-2.02.96-2.29.25-.28.55-.35.73-.35l.53.01c.17 0 .4-.06.62.48.23.55.78 1.9.85 2.04.07.14.11.3.02.48-.09.18-.14.3-.28.46-.14.16-.29.36-.41.48-.14.14-.28.29-.12.56.16.28.71 1.17 1.53 1.9 1.05.93 1.93 1.22 2.21 1.36.28.14.44.12.6-.07.16-.18.69-.8.88-1.08.18-.28.37-.23.62-.14.25.09 1.6.76 1.87.9.28.14.46.21.53.32.07.12.07.67-.18 1.36z" />
    </svg>
  );
}
