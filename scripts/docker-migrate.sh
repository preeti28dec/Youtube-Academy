#!/bin/sh
# Container start par DB schema laga deta hai.
# Migration files hon to migrate deploy (production ka sahi tareeka),
# na hon to db push (pehli baar / quick start).
set -e

if [ -d prisma/migrations ] && [ -n "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  echo "[migrate] prisma migrate deploy"
  npx prisma migrate deploy
else
  echo "[migrate] prisma/migrations khaali hai -> prisma db push"
  npx prisma db push --skip-generate
fi

if [ "$SEED_ON_START" = "true" ]; then
  echo "[migrate] seeding demo data (SEED_ON_START=true)"
  npx tsx prisma/seed.ts
fi

echo "[migrate] done"
