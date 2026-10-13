"use client";

import { useEffect, useRef, useState } from "react";
import { LockIcon } from "./icons";

/**
 * Secure player.
 *
 * <video src> mein kabhi seedha file path nahi hota — har baar server se
 * short-lived signed URL maanga jaata hai. Watermark par student ka
 * email/mobile dikhta hai, taaki screen recording leak ho to pata chale
 * kisne kiya.
 */
export function SecureVideoPlayer({
  lessonId,
  watermark,
  poster,
  labels,
}: {
  lessonId: string;
  watermark: string;
  poster?: string;
  labels: { secure: string; loading: string; failed: string };
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setSrc(null);
    setError(null);

    (async () => {
      try {
        const res = await fetch("/api/video/token", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ lessonId }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) throw new Error(data.error ?? labels.failed);
        setSrc(data.url);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : labels.failed);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  return (
    <div className="relative aspect-video select-none overflow-hidden rounded-[14px] bg-[#0e1014]">
      {src ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          playsInline
          preload="metadata"
          onContextMenu={(e) => e.preventDefault()}
          className="h-full w-full"
          onError={() =>
            setError(labels.failed)
          }
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-6 text-center">
          <span className="text-[13.5px] font-medium text-onDark">
            {error ?? labels.loading}
          </span>
        </div>
      )}

      {/* Student watermark — leak hone par source trace karne ke liye. */}
      <span className="pointer-events-none absolute top-[22%] left-[12%] text-xs font-semibold leading-snug text-white/30 mix-blend-difference">
        {watermark}
      </span>

      <span className="pointer-events-none absolute top-3 right-3 flex items-center gap-1.5 rounded-[7px] bg-white/10 px-2.25 py-1.5 text-[11px] font-semibold text-onDark">
        <LockIcon size={12} />
        {labels.secure}
      </span>
    </div>
  );
}
