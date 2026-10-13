function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env var: ${name} (.env file check karein)`);
  return v;
}

export const env = {
  authSecret: required("AUTH_SECRET", "dev-only-insecure-secret-change-me-32chars"),
  videoSecret: required("VIDEO_TOKEN_SECRET", "dev-only-insecure-video-secret-change"),
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
