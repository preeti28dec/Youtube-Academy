/**
 * Course ka shuruaati content — ek hi jagah, taaki local seed script aur
 * production ka first-run bootstrap dono wahi data use karein.
 *
 * Yeh sirf shuruaat hai. Live hone ke baad Sohail /admin se modules aur
 * lessons add/edit/delete karte hain; yeh file dobara nahi chalti.
 */

/** [module title, [[lesson title, duration, isFree?], ...]] */
export const SYLLABUS: [string, [string, string, boolean?][]][] = [
  [
    "YouTube Basics & Channel Setup",
    [
      ["Course introduction", "06:12", true],
      ["Channel ka niche kaise choose karein", "14:30"],
      ["Channel setup: name, logo, banner", "18:05"],
      ["YouTube Studio ka overview", "12:40"],
    ],
  ],
  [
    "Content Planning & Research",
    [
      ["Video ideas kaise dhundhein", "16:20"],
      ["Keyword research tools", "19:45"],
      ["Competitor analysis", "13:10"],
    ],
  ],
  [
    "Mobile se Shooting & Editing",
    [
      ["Mobile shooting setup", "15:00", true],
      ["Lighting aur audio basics", "11:35"],
      ["Mobile editing step-by-step", "24:50"],
      ["Shorts kaise banayein", "17:15"],
    ],
  ],
  [
    "Thumbnail, Title & SEO",
    [
      ["Click-worthy thumbnails", "20:10"],
      ["Title aur description likhna", "14:25"],
      ["Tags, hashtags aur chapters", "10:55"],
    ],
  ],
  [
    "Growth & Audience",
    [
      ["Upload schedule aur consistency", "09:40"],
      ["YouTube Analytics samjhein", "21:30"],
      ["Comments aur community se judna", "08:50"],
    ],
  ],
  [
    "Monetization",
    [
      ["YPP eligibility aur apply karna", "13:20"],
      ["Sponsorship aur brand deals", "16:45"],
      ["Affiliate income", "12:05"],
    ],
  ],
];

export const COURSE = {
  slug: "youtube-growth-masterclass",
  title: "YouTube Growth Masterclass",
  subtitle: "Hindi mein · Mobile-friendly · Lifetime access",
  description:
    "Yeh course un logon ke liye hai jo YouTube channel shuru karna chahte hain ya apne existing channel ko grow karna chahte hain. Saari videos Hindi mein hain aur mobile par aaram se dekhi ja sakti hain. Course ke end tak aap khud video plan, shoot, edit aur publish kar payenge.",
  pricePaise: 149900,
};

export function toSeconds(mmss: string): number {
  const [m, s] = mmss.split(":").map((n) => parseInt(n, 10) || 0);
  return m * 60 + s;
}
