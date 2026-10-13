import crypto from "node:crypto";
import { env } from "./env";

/**
 * Razorpay integration — SDK ke bina, sirf REST + HMAC.
 * Ek hi jagah badal kar Cashfree par bhi shift kiya ja sakta hai.
 *
 * Keys na hone par "demo mode": order id locally banta hai aur verify
 * signature check skip karta hai. Isse poora flow (account create, course
 * unlock, webhook) bina gateway account ke bhi test ho jaata hai.
 */

export type GatewayOrder = {
  gatewayOrderId: string;
  amountPaise: number;
  live: boolean;
};

export async function createGatewayOrder(
  amountPaise: number,
  receipt: string,
): Promise<GatewayOrder> {
  if (!env.gatewayLive) {
    return { gatewayOrderId: `demo_${crypto.randomUUID()}`, amountPaise, live: false };
  }

  const auth = Buffer.from(`${env.razorpayKeyId}:${env.razorpayKeySecret}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Basic ${auth}` },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt }),
  });

  if (!res.ok) {
    throw new Error(`Razorpay order banane mein dikkat: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { id: string; amount: number };
  return { gatewayOrderId: data.id, amountPaise: data.amount, live: true };
}

/** Checkout ke baad browser se aaya signature. Demo mode mein hamesha true. */
export function verifyPaymentSignature(
  gatewayOrderId: string,
  paymentId: string,
  signature: string,
): boolean {
  if (!env.gatewayLive) return true;
  const expected = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(`${gatewayOrderId}|${paymentId}`)
    .digest("hex");
  return safeEqual(expected, signature);
}

/** Webhook body ka signature — yahi asli source of truth hai, browser nahi. */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  if (!env.razorpayWebhookSecret) return false;
  const expected = crypto
    .createHmac("sha256", env.razorpayWebhookSecret)
    .update(rawBody)
    .digest("hex");
  return safeEqual(expected, signature);
}

function safeEqual(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
