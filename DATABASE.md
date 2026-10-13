# Database — kaunsa, aur kyun

## Short answer: **PostgreSQL**

Is project ke liye PostgreSQL sabse sahi hai. Local development ke liye repo **SQLite** par
chalta hai taaki kisi ko database server install hi na karna pade — schema dono par bilkul
same hai, sirf ek line badalti hai.

## Kyun PostgreSQL (aur MongoDB kyun nahi)

Is site ka saara data **relational** hai — ek cheez doosri se judi hui:

```
User ──< Order >── Course ──< Module ──< Lesson
  │                   │                     │
  └──< Enrollment ────┘                     │
  └──< Progress ─────────────────────────────┘
```

1. **Paisa involved hai.** "Payment hua → account bana → enrollment mila" — yeh teeno ek saath
   hone chahiye, ya ek bhi nahi. Postgres transactions yeh guarantee deta hai. (Code mein:
   `src/lib/enroll.ts` ka `prisma.$transaction`.)
2. **Duplicate rokna zaroori hai.** `Enrollment` par `@@unique([userId, courseId])` aur
   `Progress` par `@@unique([userId, lessonId])` — DB khud double enrollment reject karta hai,
   chahe webhook do baar aa jaaye. MongoDB mein yeh application code mein sambhalna padta.
3. **Reporting aasaan.** "Is mahine kitne students", "kis lesson par log atak rahe hain" —
   ek SQL query. Admin panel ke stats isi par chalte hain.
4. **Sasta aur aam.** Neon, Supabase, Railway — sabke free/₹0 tier hain, aur har Indian
   hosting provider Postgres deta hai. DBA rakhne ki zaroorat nahi.

**MySQL bhi theek chalega** — upar ke saare points ispar bhi lagu hote hain. Postgres isliye
chuna kyunki free managed tiers behtar hain aur JSON/full-text baad mein chahiye to mil jaata hai.
Prisma mein provider badalna 1 line ka kaam hai.

**MongoDB is project ke liye theek nahi** — data relational hai, aur payments mein
transactions + unique constraints ka DB-level hona zyada safe hai.

## Local dev SQLite par kyun

- Koi server install nahi, koi Docker nahi, koi port nahi — `npm run setup` aur bas.
- Ek file (`prisma/dev.db`). Kharab ho jaaye to delete karke dobara seed.
- Schema mein koi bhi provider-specific feature use nahi kiya gaya (na enum, na array, na
  native JSON), isliye wahi schema Postgres par bina badlaav chalta hai.

## Postgres par switch (production)

**1.** Managed Postgres lein (Neon / Supabase / Railway / apka hosting provider).

**2.** `prisma/schema.prisma` mein ek line badlein:

```diff
 datasource db {
-  provider = "sqlite"
+  provider = "postgresql"
   url      = env("DATABASE_URL")
 }
```

**3.** `.env` mein connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/sya?sslmode=require"
```

**4.** Migration banayein aur chalayein:

```bash
npx prisma migrate dev --name init     # ek baar, local par — migration file banti hai
npx prisma migrate deploy              # server par, har deploy ke saath
```

> Dev mein humne `prisma db push` use kiya (fast, migration files ke bina).
> Production mein hamesha `migrate` use karein — tabhi schema changes ka record rehta hai
> aur rollback possible hota hai.

**5.** Course content daalein. Seed script demo data ke liye hai aur **purana data delete kar
deta hai** — production par ise mat chalayein. Wahan `/admin` se modules/lessons add karein.

## Backup

Managed Postgres (Neon/Supabase) automatic daily backup deta hai — bas panel mein on hai ya
nahi, ek baar check kar lein. Apna server ho to:

```bash
pg_dump "$DATABASE_URL" | gzip > backup-$(date +%F).sql.gz
```

Videos DB mein nahi hain — unka backup video host (VdoCipher/Bunny) ke paas rehta hai.
