import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { verifyVideoToken } from "@/lib/video-token";
import { parseVideoSource } from "@/lib/video-source";

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
 * Teen layer:
 *   1. token signature + expiry (2 min)
 *   2. token ka userId == current session user  -> link share karna bekaar
 *   3. source sanitize -> na directory traversal, na internal-network URL
 *
 * Source do tarah ka ho sakta hai (lib/video-source.ts dekhein): local file
 * (self-hosted / Docker) ya external URL (Vercel aur CDN ke liye), jise yeh
 * route proxy karta hai taaki asli URL kabhi browser tak na pahunche.
 *
 * Production ke liye sabse achha: VdoCipher / Bunny Stream ka OTP ya signed
 * URL yahan se return karna — tab video hamare server se guzarti hi nahi aur
 * DRM + domain lock bhi mil jaata hai.
 */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  const payload = verifyVideoToken(token);
  if (!payload) {
    return NextResponse.json(
      { error: "This link has expired. Refresh the page." },
      { status: 403 },
    );
  }

  // Token kisi aur ko bheja gaya ho to yahan fail hota hai.
  const user = await getCurrentUser();
  const currentId = user?.id ?? "guest";
  if (payload.userId !== currentId) {
    return NextResponse.json({ error: "This link does not belong to your account." }, { status: 403 });
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: payload.lessonId },
    select: { videoKey: true },
  });

  const source = parseVideoSource(lesson?.videoKey ?? null);
  if (!source) {
    return NextResponse.json(
      { error: "No video has been added to this lesson yet." },
      { status: 404 },
    );
  }

  const range = req.headers.get("range");
  return source.kind === "url"
    ? streamFromUrl(source.url, range)
    : streamFromDisk(source.name, range);
}

/** Har response par — browser aur CDN dono signed stream cache na karein. */
function baseHeaders(): Headers {
  return new Headers({
    "Content-Type": "video/mp4",
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-store, private",
    // Browser ko "download" ke bajaye inline play karne ko kehte hain.
    "Content-Disposition": "inline",
  });
}

function rangeNotSatisfiable(size: number) {
  return new NextResponse(null, {
    status: 416,
    headers: { "Content-Range": `bytes */${size}` },
  });
}

/** Self-hosted / Docker: media/ folder se, HTTP Range ke saath taaki seek chale. */
async function streamFromDisk(name: string, range: string | null) {
  const filePath = path.join(VIDEO_DIR, name);

  let stat: fs.Stats;
  try {
    stat = await fs.promises.stat(filePath);
    if (!stat.isFile()) throw new Error("not a file");
  } catch {
    return NextResponse.json(
      {
        error: `Video file not found: media/${name}. Put any mp4 there with that name, or paste a video URL in the admin panel.`,
      },
      { status: 404 },
    );
  }

  const headers = baseHeaders();

  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (!match) return rangeNotSatisfiable(stat.size);

    const start = match[1] ? Number(match[1]) : 0;
    const end = match[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1;

    if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= stat.size) {
      return rangeNotSatisfiable(stat.size);
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

/**
 * Serverless / CDN: upstream se laakar aage bhejta hai.
 *
 * Range header waise ka waisa pass hota hai, isliye seeking chalti hai aur
 * poori file memory mein nahi aati — body stream ki tarah pipe hoti hai.
 * Asli URL browser tak kabhi nahi jaata.
 */
async function streamFromUrl(url: string, range: string | null) {
  let upstream: Response;
  try {
    upstream = await fetch(url, {
      headers: range ? { Range: range } : undefined,
      cache: "no-store",
      // Upstream kisi aur jagah bhej raha ho to aage na jaayein (SSRF guard).
      redirect: "manual",
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the video host. Please try again shortly." },
      { status: 502 },
    );
  }

  if (upstream.status >= 300 && upstream.status < 400) {
    return NextResponse.json(
      { error: "The video host is redirecting. Use the direct file URL in the admin panel." },
      { status: 502 },
    );
  }
  if (!upstream.ok && upstream.status !== 206) {
    return NextResponse.json(
      { error: `The video host returned ${upstream.status}.` },
      { status: 502 },
    );
  }

  const headers = baseHeaders();
  // Upstream ki length/range/type aage bhej dein, taaki player seek kar sake.
  for (const h of ["content-length", "content-range", "content-type"]) {
    const v = upstream.headers.get(h);
    if (v) headers.set(h, v);
  }

  return new Response(upstream.body, { status: upstream.status, headers });
}
