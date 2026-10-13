# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Sohail YouTube Academy
#
# Teen stage:
#   deps     -> npm ci (cache layer)
#   builder  -> prisma generate + next build  (migrator ka base bhi yahi hai)
#   runner   -> sirf standalone output, chhota final image
#
# Image hamesha PostgreSQL ke liye build hota hai — scripts/switch-db.mjs
# build ke andar provider badal deta hai, isliye repo ka schema local dev
# ke liye sqlite par hi rehta hai.
# ---------------------------------------------------------------------------

FROM node:22-alpine AS base
# Prisma ko alpine par libc6-compat + openssl chahiye hota hai.
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1


# ---------- deps ----------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts


# ---------- builder ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Postgres + Alpine ke liye schema taiyaar karo, phir client generate karo.
RUN node scripts/switch-db.mjs postgresql --musl && npx prisma generate

# Build ke waqt DB se connect nahi hota (saare pages dynamic hain), lekin
# Prisma ko ek syntactically valid URL chahiye hota hai.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
ENV AUTH_SECRET="build-time-placeholder-not-used-at-runtime"
ENV VIDEO_TOKEN_SECRET="build-time-placeholder-not-used-at-runtime"
# next.config.ts isi flag par standalone output on karta hai.
ENV DOCKER_BUILD=1
RUN npx next build


# ---------- migrator ----------
# Poore node_modules ke saath, taaki prisma CLI bina kisi missing dep ke chale.
# Compose ise ek baar chalata hai, phir app start hota hai.
FROM builder AS migrator
CMD ["sh", "scripts/docker-migrate.sh"]


# ---------- runner ----------
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
# 0.0.0.0 zaroori hai — warna container ke bahar se reach nahi hoga.
ENV HOSTNAME=0.0.0.0

RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Uploaded videos ka folder — compose isi par named volume mount karta hai,
# warna container restart par videos chali jaayengi.
RUN mkdir -p /app/media && chown nextjs:nodejs /app/media

USER nextjs
EXPOSE 3000

# Standalone output apna chhota server likhta hai.
CMD ["node", "server.js"]
