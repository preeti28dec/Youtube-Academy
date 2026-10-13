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
      ["How to choose your niche", "14:30"],
      ["Channel setup: name, logo, banner", "18:05"],
      ["A tour of YouTube Studio", "12:40"],
    ],
  ],
  [
    "Content Planning & Research",
    [
      ["How to find video ideas", "16:20"],
      ["Keyword research tools", "19:45"],
      ["Competitor analysis", "13:10"],
    ],
  ],
  [
    "Shooting & Editing on Mobile",
    [
      ["Mobile shooting setup", "15:00", true],
      ["Lighting and audio basics", "11:35"],
      ["Mobile editing, step by step", "24:50"],
      ["How to make Shorts", "17:15"],
    ],
  ],
  [
    "Thumbnail, Title & SEO",
    [
      ["Click-worthy thumbnails", "20:10"],
      ["Writing titles and descriptions", "14:25"],
      ["Tags, hashtags and chapters", "10:55"],
    ],
  ],
  [
    "Growth & Audience",
    [
      ["Upload schedule and consistency", "09:40"],
      ["Understanding YouTube Analytics", "21:30"],
      ["Engaging with comments and community", "08:50"],
    ],
  ],
  [
    "Monetization",
    [
      ["YPP eligibility and applying", "13:20"],
      ["Sponsorships and brand deals", "16:45"],
      ["Affiliate income", "12:05"],
    ],
  ],
];

export const COURSE = {
  slug: "youtube-growth-masterclass",
  title: "YouTube Growth Masterclass",
  subtitle: "In Hindi · Mobile-friendly · Lifetime access",
  description:
    "This course is for anyone who wants to start a YouTube channel, or grow the one they already have. Every video is in Hindi and watches comfortably on a phone. By the end you will be able to plan, shoot, edit and publish videos on your own.",
  pricePaise: 149900,
};

export function toSeconds(mmss: string): number {
  const [m, s] = mmss.split(":").map((n) => parseInt(n, 10) || 0);
  return m * 60 + s;
}
