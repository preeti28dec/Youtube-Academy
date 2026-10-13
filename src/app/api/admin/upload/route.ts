import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { requireAdmin } from "@/lib/auth";
import { IS_SERVERLESS } from "@/lib/video-source";

export const runtime = "nodejs";

const VIDEO_DIR = path.join(process.cwd(), "media");
const MAX_BYTES = 500 * 1024 * 1024; // 500 MB
const ALLOWED = new Set(["video/mp4", "video/webm", "video/quicktime"]);

/**
 * Local/self-hosted video upload.
 *
 * File media/ mein jaati hai — public/ ke BAHAR, kyunki public/ ki har file
 * Next.js seedha URL par serve kar deta hai. media/ se video sirf
 * /api/video/stream ke zariye nikalti hai, jo signed token maangta hai.
 *
 * Production mein isi route ki jagah VdoCipher / Bunny Stream ka upload API
 * aata hai, aur videoKey mein unka video id save hota hai — tab badi files
 * hamare server se guzarti hi nahi.
 */
export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  // Vercel jaise serverless par writable disk nahi hota — crash dene ke bajaye
  // saaf batate hain ki kya karna hai.
  if (IS_SERVERLESS) {
    return NextResponse.json(
      {
        error:
          "Is hosting par file upload nahi ho sakti (serverless par disk nahi hota). " +
          "Video apne video host (Bunny / VdoCipher / S3) par upload karein aur " +
          "uska URL lesson ke video field mein paste kar dein.",
      },
      { status: 501 },
    );
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Koi file nahi mili." }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "File khaali hai." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File 500 MB se badi hai." }, { status: 413 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Sirf mp4 / webm / mov allowed hai." }, { status: 415 });
  }

  // Naam hum khud banate hain — upload kiya hua naam path ya extension
  // spoof karne ke liye use na ho sake.
  const ext = file.type === "video/webm" ? "webm" : file.type === "video/quicktime" ? "mov" : "mp4";
  const key = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;

  await fs.promises.mkdir(VIDEO_DIR, { recursive: true });
  await fs.promises.writeFile(
    path.join(VIDEO_DIR, key),
    Buffer.from(await file.arrayBuffer()),
  );

  return NextResponse.json({ ok: true, videoKey: key });
}
