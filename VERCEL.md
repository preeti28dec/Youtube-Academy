# Vercel par deploy

> **Deploy ab fail nahi hoti.** DATABASE_URL na hone par bhi build pass ho jaati hai aur
> site live ho jaati hai — har page par ek **/setup** screen dikhti hai jo batati hai ki
> kaunsa environment variable baaki hai. DATABASE_URL set karte hi woh screen apne aap hat
> jaati hai aur asli site chalne lagti hai.

> **Chhota jawab:** app Vercel par chalta hai, lekin **do cheezein aapko deni padengi** —
> ek Postgres database aur videos ke liye ek external host ka URL. SQLite aur disk par
> rakhi files Vercel par kaam nahi karti (serverless par persistent disk hota hi nahi).
> Code side ka kaam ho chuka hai: `vercel.json`, Postgres migrations, aur video URL
> support repo mein hain.

---

## Vercel par kya nahi chalta (aur kyun)

| Cheez | Local / Docker | Vercel |
| --- | --- | --- |
| **SQLite** (`file:./dev.db`) | chalta hai | **nahi** — Vercel ka filesystem read-only aur ephemeral hai. DB file na likh sakte hain, na bachegi. |
| **Video upload** (`/api/admin/upload` → `media/`) | chalta hai | **nahi** — disk par likhna allowed nahi. Route ab saaf 501 deta hai: video host par upload karke URL paste karein. |
| **Video streaming** | disk se | **chalta hai** — lesson ke video field mein URL daalein, server use proxy kar deta hai (access check waisa hi). |
| Baaki sab (pages, auth, payment, progress) | chalta hai | chalta hai |

Yeh koi bug nahi hai — Vercel serverless hai, usme persistent disk hota hi nahi.
Local aur Docker setup disk use karta hai kyunki wahan disk hai.

---

## Fix — teen step

### 1. PostgreSQL lagayein

SQLite ki jagah managed Postgres. Free options: **Neon**, **Supabase**, ya Vercel ka apna
Postgres (Storage tab → Create Database).

Connection string copy karke agle step mein `DATABASE_URL` ki tarah daal dein. **Bas itna hi** —
baaki repo mein pehle se taiyaar hai:

- `vercel.json` ka build command `node scripts/vercel-build.mjs` hai. Woh script
  provider ko `postgresql` karti hai, client generate karti hai, migrations lagati hai,
  phir `next build` chalati hai — **har step ka naam log mein aata hai**, isliye kuch
  toote to pata chal jaata hai ki kahan.
- Woh do aam dikkatein khud sambhaalti hai: `DATABASE_URL` na hone par saaf message
  (kya karna hai uske saath), aur `P3005` (DB mein tables pehle se hain) par
  `0_init` ko baseline maan kar aage badh jaati hai.
- `prisma/migrations/0_init/` mein Postgres ka initial migration commit hai.
- Repo ka `schema.prisma` `sqlite` par hi rehta hai, taaki `npm run dev` local par
  bina kisi DB server ke chalta rahe.

> Local par bhi Postgres chahiye to: `npm run db:use-postgres` (wapas: `npm run db:use-sqlite`).

### 2. Environment variables (Settings → Environment Variables)

Production, Preview — dono par:

| Name | Value |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (`?sslmode=require` ke saath). **Quotes mat lagayein** — dashboard poori string literal maanta hai. |
| `AUTH_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `VIDEO_TOKEN_SECRET` | wahi command, **alag** value |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `91XXXXXXXXXX` |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | live keys (ya khaali = demo mode) |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay dashboard wala secret |

Env var add karne ke baad **redeploy** karna padta hai — purana build naye vars nahi uthata.

### 3. Videos external host par

Video apne host (Bunny, S3, R2, Cloudflare) par upload karein aur admin panel mein
lesson ke **video field mein uska URL paste** kar dein. Bas itna hi — code change
nahi chahiye.

Server us URL ko proxy karta hai, isliye:

- asli CDN URL browser tak kabhi nahi jaata,
- signed 2-minute token aur enrollment check waise ke waise lagte hain,
- Range (seeking) pass-through hota hai, poori file memory mein nahi aati.

> **Aage ke liye:** sabse strong option VdoCipher / Bunny Stream ka OTP ya signed URL
> `/api/video/token` se return karna hai — tab DRM aur domain lock bhi mil jaate hain
> aur video hamare server se guzarti hi nahi.

---

## Deploy se pehle checklist

- [ ] Postgres database bana liya aur uska connection string haath mein hai
- [ ] Saare env vars Production + Preview dono par set hain
- [ ] Env vars set karne ke **baad** redeploy kiya
- [ ] Razorpay webhook URL `https://<domain>/api/payment/webhook` par point karta hai
- [ ] Har lesson ke video field mein external URL hai (Vercel par local file nahi chalti)

---

## Build fail ho to

Log mein `[build] <step ka naam>` dhoondhein — jis step ke baad `[build] ruk gaya`
aaya, wahi toota hai.

| Log mein | Matlab | Fix |
| --- | --- | --- |
| `[build] setup adhoora` | DATABASE_URL nahi hai — build phir bhi pass hogi | site /setup page dikhayegi; step 1-2 karke redeploy |
| `postgres ka URL nahi lag raha` | value quotes ke saath hai, ya SQLite ka `file:...` hai | quotes hata dein; postgres string daalein |
| `Database tak pahunch nahi paaye` (P1001) | URL hai, connection nahi bana | password/host check karein; `?sslmode=require` lagayein |
| `P3005` | DB mein tables pehle se hain | script khud baseline kar leti hai; na ho to niche dekhein |
| `next build fail hua` | code ya type error | upar ka asli error padhein |

`P3005` khud na sulajhe (jaise DB mein adhoora schema pada ho) to seedha sabse aasaan
raasta: us database ko khaali kar dein (Neon/Supabase par naya database bana lein) aur
redeploy karein — initial migration poora schema khud bana degi.

Env var add/badalne ke **baad redeploy zaroori hai**. Purana build naye vars nahi uthata.

---

## Kya Vercel hi sahi choice hai?

Is app ke liye **ek chhota VPS (Docker ke saath) aasaan aur sasta pad sakta hai**:

| | Vercel | VPS + Docker |
| --- | --- | --- |
| Setup | Postgres alag, video host alag, upload flow badalna padega | `docker compose up` — app + Postgres + disk, sab ek jagah |
| Video upload/stream | kaam nahi karega, external host zaroori | abhi jaisa hai, waisa hi chalega |
| Kharcha | free tier + Postgres + video host | ₹400–₹1,700/mahina sab milakar |
| Scaling | automatic | khud dekhna padta hai |

Agar video host (Bunny/VdoCipher) waise bhi lena hai — jo security ke liye
**recommended hai** — to Vercel ka nuksaan kam ho jaata hai, aur uska auto-scaling
aur free SSL faayda ban jaata hai.

Docker wala setup `docker-compose.yml` mein taiyaar hai (README ka Docker section dekhein).
