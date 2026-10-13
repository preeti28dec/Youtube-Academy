# Vercel par deploy

> **Chhota jawab:** app Vercel par chal sakta hai, lekin **do cheezein pehle badalni
> padengi** — database (SQLite nahi chalega) aur video hosting (disk par file nahi rakh sakte).
> Bina inke deploy ya to build par rukega ya live site 500 degi.

---

## Vercel par kya nahi chalta (aur kyun)

| Cheez | Local / Docker | Vercel |
| --- | --- | --- |
| **SQLite** (`file:./dev.db`) | chalta hai | **nahi** — Vercel ka filesystem read-only aur ephemeral hai. DB file na likh sakte hain, na bachegi. |
| **Video upload** (`/api/admin/upload` → `media/`) | chalta hai | **nahi** — disk par likhna allowed nahi (sirf `/tmp`, jo har request ke baad gayab ho sakta hai). |
| **Video streaming** (`/api/video/stream` disk se padhta hai) | chalta hai | **nahi** — file hi nahi hogi. |
| Baaki sab (pages, auth, payment, progress) | chalta hai | chalta hai |

Yeh koi bug nahi hai — Vercel serverless hai, usme persistent disk hota hi nahi.
Local aur Docker setup disk use karta hai kyunki wahan disk hai.

---

## Fix — teen step

### 1. PostgreSQL lagayein

SQLite ki jagah managed Postgres. Free options: **Neon**, **Supabase**, ya Vercel ka apna
Postgres (Storage tab se).

```bash
npm run db:use-postgres     # schema.prisma ka provider badal deta hai
git add prisma/schema.prisma && git commit -m "Postgres par shift" && git push
```

Phir ek baar migration bana ke push karein:

```bash
# .env mein DATABASE_URL ko Postgres ka string kar dein, phir:
npx prisma migrate dev --name init
git add prisma/migrations && git commit -m "init migration" && git push
```

Aur Vercel ka build command badal dein (Settings → General → Build Command):

```
prisma generate && prisma migrate deploy && next build
```

> Local par wapas SQLite chahiye to `npm run db:use-sqlite`.

### 2. Environment variables (Settings → Environment Variables)

Production, Preview — dono par:

| Name | Value |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (`?sslmode=require` ke saath) |
| `AUTH_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `VIDEO_TOKEN_SECRET` | wahi command, **alag** value |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `91XXXXXXXXXX` |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | live keys (ya khaali = demo mode) |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay dashboard wala secret |

Env var add karne ke baad **redeploy** karna padta hai — purana build naye vars nahi uthata.

### 3. Videos external host par

`src/app/api/video/token/route.ts` mein jahan abhi local stream URL banti hai, wahan
VdoCipher/Bunny ka signed URL (ya OTP) return karwayein. Access-check wala poora code
waisa hi rehta hai — sirf aakhri line badalti hai.

Admin upload ke liye: browser se seedha video host par upload karwayein aur DB mein
sirf unka `videoKey` save karein. Tab badi files Vercel se guzregi hi nahi
(Vercel par request body ki limit bhi hai).

---

## Deploy se pehle checklist

- [ ] `npm run db:use-postgres` chalaya aur commit kiya
- [ ] `prisma/migrations/` commit mein hai
- [ ] Build command mein `prisma migrate deploy` hai
- [ ] Saare env vars Production + Preview dono par set hain
- [ ] Env vars set karne ke **baad** redeploy kiya
- [ ] Razorpay webhook URL `https://<domain>/api/payment/webhook` par point karta hai

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
