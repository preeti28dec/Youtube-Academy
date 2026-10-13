import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { verifyVideoToken } from "@/lib/video-token";

export const runtime = "nodejs";

/**
 * Local demo videos yahan rakhein: <project>/media/<file>.mp4
 *
 * Yeh folder jaan-boojh kar public/ ke BAHAR hai — public/ ki har file Next.js
 * seedha /<path> par serve kar deta hai, jisse signed token ka koi matlab nahi
 * rehta. media/ se file sirf isi route ke zariye nikalti hai.
 */
const VIDEO_DIR = path.join(process.cwd(), "media");

/**
 * Signed video stream.
 *
 * Yeh route local/self-hosted setup ke liye hai. Production mein isi jagah
 * VdoCipher ya Bunny Stream ka OTP/signed URL return hota hai (DATABASE.md
 * aur /guide page mein details) — tab video hamare server se guzarti hi nahi.
 *
 * Teen layer:
 *   1. token signature + expiry (2 min)
 *   2. token ka userId == current session user  -> link share karna bekaar
 *   3. file path sanitize -> videoKey se directory traversal possible nahi
 */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  const payload = verifyVideoToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Link expire ho gaya. Page refresh karein." }, { status: 403 });
  }

  // Token kisi aur ko bheja gaya ho to yahan fail hota hai.
  const user = await getCurrentUser();
  const currentId = user?.id ?? "guest";
  if (payload.userId !== currentId) {
    return NextResponse.json({ error: "Yeh link aapke account ka nahi hai." }, { status: 403 });
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: payload.lessonId },
    select: { videoKey: true },
  });
  if (!lesson?.videoKey) {
    return NextResponse.json({ error: "Is lesson ki video abhi upload nahi hui." }, { status: 404 });
  }

  // basename se "../" jaise jugaad kat jaate hain.
  const safeName = path.basename(lesson.videoKey);
  const filePath = path.join(VIDEO_DIR, safeName);

  let stat: fs.Stats;
  try {
    stat = await fs.promises.stat(filePath);
    if (!stat.isFile()) throw new Error("not a file");
  } catch {
    return NextResponse.json(
      {
        error: `Video file nahi mili: media/${safeName}. Koi bhi mp4 isi naam se rakh dein.`,
      },
      { status: 404 },
    );
  }

  const headers = new Headers({
    "Content-Type": "video/mp4",
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-store, private",
    // Browser ko "download" ke bajaye inline play karne ko kehte hain.
    "Content-Disposition": "inline",
  });

  // Seeking ke liye HTTP Range support — iske bina video scrub nahi hoti.
  const range = req.headers.get("range");
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (!match) {
      return new NextResponse(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${stat.size}` },
      });
    }

    const start = match[1] ? Number(match[1]) : 0;
    const end = match[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1;

    if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= stat.size) {
      return new NextResponse(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${stat.size}` },
      });
    }

    headers.set("Content-Range", `bytes ${start}-${end}/${stat.size}`);
    headers.set("Content-Length", String(end - start + 1));
    const stream = fs.createReadStream(filePath, { start, end });
    return new Response(Readable.toWeb(stream) as ReadableStream, { status: 206, headers });
  }

  headers.set("Content-Length", String(stat.size));
  const stream = fs.createReadStream(filePath);
  return new Response(Readable.toWeb(stream) as ReadableStream, { status: 200, headers });
}
