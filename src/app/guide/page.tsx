import { ShieldIcon } from "@/components/icons";

export const metadata = { title: "Project guide · Sohail YouTube Academy" };

const SECURITY_POINTS = [
  {
    t: "Secure video hosting",
    d: "Videos YouTube/Google Drive par nahi, VdoCipher ya Bunny Stream jaise paid secure host par upload hongi. Wahan koi public download link hota hi nahi.",
  },
  {
    t: "Har baar naya, expire hone wala link",
    d: "Jab enrolled student lesson kholta hai, server check karta hai ki usne payment kiya hai, phir sirf usi ke liye kuch minute ka signed token banata hai. Link copy karke kisi aur ko bhejne par woh chalega nahi.",
  },
  {
    t: "Encrypted streaming + DRM",
    d: "Video chhote encrypted tukdon (HLS/DRM) mein stream hoti hai. Download manager ya “inspect element” se poori file nahi milti.",
  },
  {
    t: "Domain lock",
    d: "Player sirf aapki website ke domain par chalega. Kisi aur site par embed karne se video nahi khulegi.",
  },
  {
    t: "Student ka watermark",
    d: "Video ke upar student ka email/mobile halka sa dikhta rahega. Agar koi recording leak kare to pata chal jayega kisne kiya.",
  },
  {
    t: "Login limit",
    d: "Ek account ek time par 1–2 device par hi login rahega, taaki password share karke kai log ek account na chalayein.",
  },
];

const FEATURE_GUIDE = [
  {
    t: "Home / Landing page",
    d: "Course ka parichay, benefits, price aur Enroll Now / Buy Now button. Intro video free preview ke roop mein.",
  },
  {
    t: "Course details",
    d: "Poora description, “aap kya seekhenge”, aur saare modules/lessons ki list duration ke saath. Free preview lessons alag se marked.",
  },
  {
    t: "Payment page",
    d: "Naam, mobile, email bharke Razorpay ya Cashfree se UPI, Card, Net Banking ke through payment.",
  },
  {
    t: "Auto account + access",
    d: "Payment confirm hote hi account apne aap banta hai, course unlock hota hai, aur password email/WhatsApp par jaata hai.",
  },
  {
    t: "Student login",
    d: "Email ya mobile + password se login. “Password bhool gaye” se email/OTP ke zariye reset.",
  },
  {
    t: "Student dashboard",
    d: "Kharida hua course, saare modules aur lessons, aur “Continue learning” button jo agle adhure lesson par le jaata hai.",
  },
  {
    t: "Video course",
    d: "Saari videos website ke andar hi secure player mein chalti hain. Bina login/payment ke koi lesson nahi khulta (free preview chhodkar).",
  },
  {
    t: "Progress tracking",
    d: "Har lesson par “Mark as complete”. Dashboard par percentage aur har module mein kitne lesson complete hue, dikhta hai.",
  },
  {
    t: "WhatsApp support",
    d: "Har page par neeche-right mein WhatsApp button, jo aapke number par pehle se likhe message ke saath chat kholta hai.",
  },
  {
    t: "Admin panel",
    d: "Module aur lesson add/edit/delete, video upload, free preview set karna, aur students ki list (naam, mobile, email, date, progress).",
  },
  {
    t: "Mobile friendly",
    d: "Saare pages mobile ke liye pehle design kiye gaye hain — bade buttons, ek-column layout, aur mobile par full-width video.",
  },
  {
    t: "Simple design",
    d: "Halka, saaf look. Koi bhaari animation ya extra features nahi, taaki site tez chale aur maintenance sasta rahe.",
  },
];

const STACK = [
  {
    k: "Website + admin",
    v: "Next.js 15 (React) — ek hi app mein frontend aur Node.js backend. Sirf yahi 12 features, koi extra plugin nahi.",
  },
  {
    k: "Database",
    v: "PostgreSQL (Prisma ORM ke saath) — students, orders, lessons aur progress ke liye. Local dev SQLite par chalta hai, bina kisi server setup ke.",
  },
  {
    k: "Payment gateway",
    v: "Razorpay ya Cashfree — UPI, Card, Net Banking, aur webhook se payment confirmation.",
  },
  {
    k: "Video hosting",
    v: "VdoCipher (DRM + watermark, sabse zyada secure) ya Bunny Stream (sasta, token + domain lock).",
  },
  {
    k: "Email / SMS",
    v: "Login details aur password reset ke liye transactional email (jaise Brevo / Amazon SES).",
  },
  {
    k: "Hosting",
    v: "Ek chhota cloud server ya managed hosting + SSL (https). Videos alag host par rehne se server halka rahega.",
  },
];

const FLOW = [
  "Student pays",
  "Gateway webhook verify",
  "Account create",
  "Course unlock",
  "Login link email + WhatsApp",
];

export default function GuidePage() {
  return (
    <div className="mx-auto flex w-full max-w-[860px] flex-col gap-5.5 px-5 pt-10 pb-20">
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold tracking-[0.09em] uppercase text-faint">
          Project guide
        </span>
        <h1 className="text-[clamp(26px,4vw,34px)] font-extrabold leading-[1.15] tracking-[-0.025em] text-ink">
          Website ki poori jaankari
        </h1>
        <p className="text-[15.5px] leading-[1.65] text-body">
          Har feature kaise kaam karega, kaunsi services lagengi, aur course videos kaise secure
          rahenge.
        </p>
      </div>

      {/* ---------- video security ---------- */}
      <section className="flex flex-col gap-3.5 rounded-2xl bg-ink p-[clamp(20px,4vw,30px)] text-white">
        <h2 className="flex items-center gap-2.5 text-[19px] font-extrabold leading-snug">
          <ShieldIcon size={20} className="shrink-0 text-[#7b81f0]" />
          Kya koi direct video link se course dekh paayega?
        </h2>
        <p className="text-base leading-relaxed font-semibold">
          Nahi. Agar videos secure video hosting (jaise VdoCipher ya Bunny Stream) par hon aur
          neeche diye gaye steps follow hon, to bina payment wala koi bhi vyakti link copy karke
          video nahi chala payega.
        </p>

        <ol className="flex flex-col gap-3 pt-1">
          {SECURITY_POINTS.map((p, i) => (
            <li key={p.t} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-[#7b81f0]/20 text-xs font-bold text-[#a9adf6]">
                {i + 1}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-[14.5px] font-bold leading-snug">{p.t}</span>
                <span className="text-sm leading-relaxed text-onDark">{p.d}</span>
              </div>
            </li>
          ))}
        </ol>

        <p className="rounded-[10px] bg-[#d3a23e]/15 px-3.75 py-3.25 text-[13.5px] leading-relaxed font-medium text-[#f1d79a]">
          Dhyan dein: duniya ka koi bhi system mobile/screen recording ko 100% nahi rok sakta. DRM
          kai devices par recording ko black screen kar deta hai, aur watermark se leak karne wala
          student pehchana ja sakta hai — isliye leak ka risk bahut kam ho jaata hai.
        </p>
      </section>

      {/* ---------- feature list ---------- */}
      <section className="overflow-hidden rounded-2xl border border-line bg-surface">
        <h2 className="border-b border-line px-5 py-4 text-base font-bold text-ink">
          Saare features — kaise kaam karenge
        </h2>
        {FEATURE_GUIDE.map((f, i) => (
          <div
            key={f.t}
            className="flex items-start gap-3.5 border-b border-line-soft px-5 py-3.75 last:border-b-0"
          >
            <span className="w-5.5 shrink-0 font-mono text-[12.5px] font-bold leading-relaxed text-brand">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[14.5px] font-bold leading-snug text-ink">{f.t}</span>
              <span className="text-sm leading-relaxed text-body">{f.d}</span>
            </div>
          </div>
        ))}
      </section>

      {/* ---------- stack ---------- */}
      <section className="overflow-hidden rounded-2xl border border-line bg-surface">
        <h2 className="border-b border-line px-5 py-4 text-base font-bold text-ink">
          Recommended setup (kam cost, kam maintenance)
        </h2>
        {STACK.map((s) => (
          <div
            key={s.k}
            className="grid gap-x-4 gap-y-1 border-b border-line-soft px-5 py-3.5 last:border-b-0 sm:grid-cols-[180px_1fr]"
          >
            <span className="text-[13.5px] font-semibold leading-relaxed text-muted">{s.k}</span>
            <span className="text-sm leading-relaxed font-medium text-ink">{s.v}</span>
          </div>
        ))}
      </section>

      {/* ---------- payment flow ---------- */}
      <section className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5">
        <h2 className="text-base font-bold text-ink">Payment ke baad automatic flow</h2>
        <div className="flex flex-wrap items-center gap-2">
          {FLOW.map((f) => (
            <span
              key={f}
              className="rounded-[9px] bg-brand-soft px-3 py-2.25 text-[13px] font-semibold leading-snug text-brand-dark"
            >
              {f}
            </span>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-body">
          Payment gateway ka webhook server ko confirm karta hai — sirf browser ke &ldquo;success&rdquo;
          message par bharosa nahi kiya jaata. Isse fake payment se course unlock nahi hota.
        </p>
      </section>
    </div>
  );
}
