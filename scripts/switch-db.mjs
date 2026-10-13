#!/usr/bin/env node
/**
 * prisma/schema.prisma ka datasource provider badalta hai.
 *
 *   node scripts/switch-db.mjs sqlite          -> local dev (default)
 *   node scripts/switch-db.mjs postgresql      -> production
 *   node scripts/switch-db.mjs postgresql --musl  -> + Alpine/Docker ke liye binaryTargets
 *
 * Schema mein koi provider-specific field type use nahi hua (na enum, na array,
 * na native JSON), isliye sirf yeh ek line badalna kaafi hai.
 *
 * Docker build khud yeh chalata hai, isliye repo ka schema sqlite par hi rehta hai.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCHEMA = path.join(ROOT, "prisma", "schema.prisma");

const ALLOWED = new Set(["sqlite", "postgresql", "mysql"]);
const MUSL_TARGETS = '["native", "linux-musl-openssl-3.0.x"]';

const provider = process.argv[2];
const wantMusl = process.argv.includes("--musl");

if (!ALLOWED.has(provider)) {
  console.error(
    `Usage: node scripts/switch-db.mjs <${[...ALLOWED].join("|")}> [--musl]`,
  );
  process.exit(1);
}

let schema = fs.readFileSync(SCHEMA, "utf8");

// --- datasource provider ---
const dsRe = /(datasource\s+db\s*\{[^}]*?provider\s*=\s*)"[^"]*"/s;
if (!dsRe.test(schema)) {
  console.error("datasource block nahi mila — schema.prisma check karein.");
  process.exit(1);
}
schema = schema.replace(dsRe, `$1"${provider}"`);

// --- generator binaryTargets (sirf Alpine/Docker ke liye) ---
const genRe = /(generator\s+client\s*\{)([^}]*)(\})/s;
schema = schema.replace(genRe, (_m, open, body, close) => {
  let next = body.replace(/\n\s*binaryTargets\s*=\s*\[[^\]]*\]/g, "");
  if (wantMusl) {
    next = next.replace(
      /(provider\s*=\s*"prisma-client-js")/,
      `$1\n  binaryTargets = ${MUSL_TARGETS}`,
    );
  }
  return open + next + close;
});

fs.writeFileSync(SCHEMA, schema);
console.log(
  `schema.prisma -> provider "${provider}"${wantMusl ? " + musl binaryTargets" : ""}`,
);
