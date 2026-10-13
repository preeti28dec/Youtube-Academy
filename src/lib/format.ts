/** 149900 => "1,499" */
export function rupees(paise: number): string {
  return new Intl.NumberFormat("en-IN").format(Math.round(paise / 100));
}

/** "14:30" => 870 */
export function toSeconds(mmss: string): number {
  const parts = mmss.split(":").map((n) => parseInt(n, 10) || 0);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return (parts[0] ?? 0) * 60 + (parts[1] ?? 0);
}

/** 7320 => "2h 2m", 870 => "15 min" */
export function humanDuration(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.round((totalSec % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m} min`;
}

export function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

/** Sirf 10 digit Indian mobile. Spaces/+91 saaf karke check karta hai. */
export function normalizeMobile(v: string): string | null {
  const digits = v.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export function formatMobile(digits: string): string {
  return digits.length === 10 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits;
}
