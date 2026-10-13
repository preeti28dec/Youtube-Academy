import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/payment";
import { grantAccess } from "@/lib/enroll";
import { sendWelcomeMessage } from "@/lib/notify";

export const runtime = "nodejs";

/**
 * Gateway server -> hamara server. Yahi payment ka asli source of truth hai.
 *
 * Razorpay dashboard mein webhook URL set karein:
 *   https://<domain>/api/payment/webhook   (event: payment.captured)
 *
 * Browser ka "success" message fake kiya ja sakta hai, isliye course access
 * ki guarantee yahan se aati hai — signature verify hone ke baad.
 */
export async function POST(req: Request) {
  // Signature raw body par banta hai, isliye parse karne se pehle text lein.
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: {
    event?: string;
    payload?: { payment?: { entity?: { id?: string; order_id?: string } } };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event !== "payment.captured") {
    // Baaki events ignore — 200 dena zaroori hai warna gateway retry karta rahega.
    return NextResponse.json({ ignored: event.event ?? null });
  }

  const payment = event.payload?.payment?.entity;
  const gatewayOrderId = payment?.order_id;
  if (!gatewayOrderId) return NextResponse.json({ error: "order_id missing" }, { status: 400 });

  const order = await prisma.order.findUnique({
    where: { gatewayOrderId },
    include: { user: true, course: { select: { title: true } } },
  });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const { newPassword } = await grantAccess(order.id, payment?.id);

  if (newPassword) {
    await sendWelcomeMessage({
      name: order.user.name,
      email: order.user.email,
      mobile: order.user.mobile,
      password: newPassword,
      courseTitle: order.course.title,
    });
  }

  return NextResponse.json({ ok: true });
}
