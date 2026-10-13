import { en, type Dictionary } from "./dictionaries/en";

/**
 * Saara user-facing text yahan se aata hai — components mein hardcode nahi.
 *
 * Abhi sirf English hai. Hindi (ya koi aur bhasha) jodni ho to:
 *   1. dictionaries/hi.ts banayein (en.ts wali shape, warna build fail hogi)
 *   2. niche DICTIONARIES mein jod dein
 *   3. header mein switcher laga dein jo locale cookie set kare
 * Components ko chhune ki zaroorat nahi padegi.
 */
const DICTIONARIES = { en } satisfies Record<string, Dictionary>;

export type Locale = keyof typeof DICTIONARIES;
export const DEFAULT_LOCALE: Locale = "en";

export function getDictionary(locale: Locale = DEFAULT_LOCALE): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

/**
 * "{count} lessons" jaise placeholders bharta hai.
 * t(d.course.lessonsCount, { count: 20 })  ->  "20 lessons"
 */
export function t(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export type { Dictionary };
