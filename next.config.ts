import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sirf Docker build ke liye — .next/standalone mein apna chhota server aur
  // sirf zaroori node_modules aate hain. Vercel ka apna bundler hai aur wahan
  // standalone output se dikkat hoti hai, isliye flag ke peeche rakha hai.
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" as const } : {}),

  // Course videos ko hotlink / iframe embed hone se rokne ke liye.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // Signed video stream kabhi cache na ho — na browser, na CDN par.
        source: "/api/video/stream",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, private" },
        ],
      },
    ];
  },
};

export default nextConfig;
