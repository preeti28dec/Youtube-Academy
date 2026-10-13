import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyPaymentSignature } from "@/lib/payment";
import { createSession } from "@/lib/auth";
import { grantAccess } from "@/lib/enroll";
import { sendWelcomeMessage } from "@/lib/notify";

export const runtime = "nodejs";

/**
 * Step 2: checkout band hone ke baad browser signature bhejta hai.
 *
 * Yeh route sirf convenience hai — student ko turant dashboard mil jaata hai.
 * Paise ka asli proof webhook hai (/api/payment/webhook), jo gateway server se
 * seedha aata hai aur browser par bharosa nahi karta.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    gatewayOrderId?: string;
    paymentId?: string;
    signature?: string;
  } | null;

  const gatewayOrderId = body?.gatewayOrderId ?? "";
  if (!gatewayOrderId) {
    return NextResponse.json({ error: "Order id missing" }, { status: 400 });
  }

  const ok = verifyPaymentSignature(gatewayOrderId, body?.paymentId ?? "", body?.signature ?? "");
  if (!ok) {
    await prisma.order.updateMany({ where: { gatewayOrderId }, data: { status: "failed" } });
    return NextResponse.json({ error: "The payment could not be verified." }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { gatewayOrderId },
    include: { user: true, course: { select: { title: true } } },
  });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const { newPassword } = await grantAccess(order.id, body?.paymentId);

  await createSession({
    id: order.user.id,
    name: order.user.name,
    email: order.user.email,
    mobile: order.user.mobile,
    role: order.user.role,
  });

  if (newPassword) {
    await sendWelcomeMessage({
      name: order.user.name,
      email: order.user.email,
      mobile: order.user.mobile,
      password: newPassword,
      courseTitle: order.course.title,
    });
  }

  if (newPassword) {
    // Password URL mein nahi bhejte — wahan se woh server logs, browser history
    // aur referrer header mein leak ho jaata hai. One-time httpOnly cookie,
    // 5 minute ki, jise success page padh kar turant delete kar deta hai.
    (await cookies()).set("sya_welcome_pw", newPassword, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 300,
    });
  }

  return NextResponse.json({ ok: true, orderId: order.id });
}
