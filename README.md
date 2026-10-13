# Sohail YouTube Academy

Ek simple, clean course-selling website — ek course, secure video lessons, aur ek chhota admin panel.
Sirf wahi 12 features jo maange gaye the; koi extra plugin ya bhaari CMS nahi, taaki development aur
maintenance cost kam rahe.

**Stack:** Next.js 15 (React 19) + Node.js backend (route handlers) · Prisma ORM · SQLite (local) /
PostgreSQL (production) · Tailwind CSS v4 · Razorpay.

Frontend aur backend ek hi app mein hain — ek deploy, ek server, ek bill.

---

## Quick start

```bash
npm install
cp .env.example .env        # phir .env mein secrets bharein (neeche dekhein)
npm run setup               # DB banata hai + demo data daalta hai
npm run dev                 # http://localhost:3000
```

`npm run setup` = `prisma db push` + seed. Seed 6 modules / 20 lessons aur demo students daalta hai.

### Demo logins

| Role    | Login                     | Password     | Page         |
| ------- | ------------------------- | ------------ | ------------ |
| Admin   | `admin@sya.test`          | `admin123`   | `/admin`     |
| Student | `rahul.sharma@gmail.com`  | `student123` | `/dashboard` |

Student ka login mobile number se bhi chalta hai: `9829041122`.

### Video chalane ke liye

Repo mein koi video file nahi hai (size ki wajah se). Koi bhi `.mp4` lekar
`media/sample.mp4` naam se rakh dein — seed ke saare lessons usi file ko point karte hain.
Ya `/admin` → *Course content* → **Video upload karein** se upload kar dein.

> `media/` folder jaan-boojh kar `public/` ke **bahar** hai. `public/` ki har file Next.js
> seedha URL par serve kar deta, jisse signed token ka koi matlab nahi rehta.

---

## Environment variables

`.env.example` copy karke `.env` banayein.

| Variable | Zaroori? | Kya hai |
| --- | --- | --- |
| `DATABASE_URL` | haan | Local: `file:./dev.db`. Production: Postgres connection string. |
| `AUTH_SECRET` | haan | Login session JWT sign karta hai. |
| `VIDEO_TOKEN_SECRET` | haan | Video playback token sign karta hai. `AUTH_SECRET` se alag rakhein. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | haan | Country code ke saath, bina `+` — jaise `919812345678`. |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | nahi | Khaali = demo mode (neeche dekhein). |
| `RAZORPAY_WEBHOOK_SECRET` | production mein haan | Webhook signature verify karne ke liye. |

Secrets generate karne ke liye:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Demo mode

Razorpay keys na hone par app **demo mode** mein chalta hai: checkout form, order, account
creation, course unlock — poora flow waisa hi chalta hai, bas asli paisa nahi katta. Keys
`.env` mein daalte hi asli Razorpay checkout khulne lagta hai; code badalne ki zaroorat nahi.

---

## Pages

| Route | Kya hai | Kaun dekh sakta hai |
| --- | --- | --- |
| `/` | Landing — benefits, price, Enroll Now | sab |
| `/course` | Poora description + syllabus accordion | sab |
| `/checkout` | Naam/mobile/email + UPI / Card / Net Banking | sab |
| `/checkout/success` | Order confirm + pehla password | buyer |
| `/login` | Email ya mobile + password | sab |
| `/dashboard` | Purchased course, modules, progress | enrolled student |
| `/learn/[lessonId]` | Secure video player + progress | enrolled (free preview sabko) |
| `/admin` | Modules/lessons CRUD + students list | admin |
| `/guide` | Client ke liye: har feature + video security ka jawab | sab |

---

## Video security kaise kaam karta hai

Sabse important sawaal tha: *"kya koi direct link se video dekh sakta hai?"* — **nahi.**

1. `<video src>` mein kabhi file ka path nahi hota. Player har baar
   `POST /api/video/token` se ek signed URL maangta hai.
2. Woh route check karta hai ki lesson free preview hai **ya** user us course mein enrolled
   hai. Enrollment row hi access ka single source of truth hai.
3. Token mein **lesson id + user id + expiry (2 min)** HMAC-signed hote hain.
4. `GET /api/video/stream` token verify karta hai **aur** token ka user id current session
   se match karata hai — isliye link copy karke kisi aur ko bhejne par woh **403** deta hai.
5. File `media/` se padhi jaati hai (public/ ke bahar), `path.basename()` se sanitize karke,
   HTTP Range support ke saath taaki seeking chale.
6. Player par student ka email/mobile watermark rehta hai — recording leak ho to source
   pata chal jaata hai.

**Production mein:** `/api/video/stream` ki jagah VdoCipher ya Bunny Stream ka OTP/signed URL
return karein. Tab video hamare server se guzarti hi nahi, aur DRM + domain lock bhi mil jaata
hai. Baaki poora access-check code waisa hi rehta hai.

Screen recording duniya ka koi system 100% nahi rok sakta — DRM kai devices par recording ko
black kar deta hai, aur watermark se leak karne wala pehchana jaata hai.

## Payment security

Course access **webhook** par milta hai, browser par nahi.
`POST /api/payment/webhook` raw body ka HMAC verify karta hai, phir enrollment deta hai.
`/api/payment/verify` sirf convenience hai (student ko turant dashboard mil jaaye) — dono
`grantAccess()` ko call karte hain, jo idempotent hai.

Razorpay dashboard mein set karein:
- URL: `https://<domain>/api/payment/webhook`
- Event: `payment.captured`
- Secret: wahi jo `RAZORPAY_WEBHOOK_SECRET` mein hai

---

## Scripts

| Command | Kya karta hai |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Prisma generate + production build |
| `npm start` | Production server (build ke baad) |
| `npm run setup` | DB schema push + seed |
| `npm run db:push` | Sirf schema push |
| `npm run db:seed` | Sirf seed (pehle purana data saaf karta hai) |
| `npm run db:studio` | Prisma Studio — DB browser |

---

## Production checklist

- [ ] `prisma/schema.prisma` mein provider `postgresql` karein, `DATABASE_URL` badlein ([DATABASE.md](./DATABASE.md))
- [ ] `AUTH_SECRET` aur `VIDEO_TOKEN_SECRET` naye random values
- [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER` mein Sohail ka asli number
- [ ] Razorpay live keys + webhook secret
- [ ] `src/lib/notify.ts` mein asli email provider (Brevo / Amazon SES) jodein — abhi sirf console par log hota hai
- [ ] Video hosting VdoCipher / Bunny Stream par shift karein
- [ ] Footer ke Privacy / Terms / Refund links par asli pages (payment gateway ko chahiye hote hain)
- [ ] HTTPS on — session cookie `secure` tabhi set hoti hai

### Abhi kya nahi bana hai

Jaan-boojh kar scope se bahar rakha gaya (requirement mein nahi tha):

- "Password bhool gaye" ka asli reset flow (link abhi login page par wapas le jaata hai)
- Login device limit (1–2 device) — `/guide` mein mention hai, implement production video host ke saath hota hai
- Multi-course support — schema taiyaar hai, UI ek course ke liye hai

## Known advisories

`npm audit` do transitive advisories dikhata hai jo **build-time dev dependencies** mein hain,
app ke runtime path mein nahi:

- `deepmerge-ts` — Prisma CLI ke `@prisma/config` ke andar
- `postcss` — Next.js ke andar bundled; Next 15 par non-breaking fix available nahi

Dono tab hatenge jab upstream release aayegi (ya Next 16 par jaane par).
