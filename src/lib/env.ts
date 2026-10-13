/**
 * Dev fallbacks sirf local ke liye hain.
 *
 * Yeh values repo mein likhi hui hain, isliye production mein inka istemaal
 * ek asli security hole hai: jiske paas repo hai woh session JWT aur video
 * token dono khud bana sakta hai — yaani admin ban kar login kar sakta hai
 * aur bina payment ke videos chala sakta hai.
 *
 * Isliye production mein fallback nahi milta. Secret na ho to app khud ko
 * "configure nahi hua" maanta hai aur middleware /setup page dikha deta hai —
 * chalne ke bajaye ruk jaana hi safe hai.
 */
const IS_PROD = process.env.NODE_ENV === "production";

const DEV_AUTH_SECRET = "dev-only-insecure-secret-change-me-32chars";
const DEV_VIDEO_SECRET = "dev-only-insecure-video-secret-change";

function secret(name: string, devFallback: string): string {
  const v = (process.env[name] ?? "").trim();
  if (v) return v;
  if (IS_PROD) {
    throw new Error(
      `${name} set nahi hai. Production mein yeh zaroori hai — ` +
        "hosting ke Environment Variables mein ek lamba random value daalein.",
    );
  }
  return devFallback;
}

/** Production chalne laayak hai? Middleware aur setup page isi se poochte hain. */
export function secretsConfigured(): boolean {
  if (!IS_PROD) return true;
  return Boolean(
    (process.env.AUTH_SECRET ?? "").trim() && (process.env.VIDEO_TOKEN_SECRET ?? "").trim(),
  );
}

export const env = {
  get authSecret() {
    return secret("AUTH_SECRET", DEV_AUTH_SECRET);
  },
  get videoSecret() {
    return secret("VIDEO_TOKEN_SECRET", DEV_VIDEO_SECRET);
  },
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID ?? "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ?? "",
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET ?? "",
  /// Keys na hon to gateway "demo mode" mein chalta hai — UI aur flow same,
  /// sirf asli paisa nahi katta. Production mein keys daalte hi real ho jaata hai.
  get gatewayLive() {
    return Boolean(this.razorpayKeyId && this.razorpayKeySecret);
  },
};
