import { prisma } from "./prisma";
import { generatePassword, hashPassword } from "./auth";

/**
 * Order ko paid mark karke course access deta hai.
 *
 * Idempotent — verify (browser) aur webhook (gateway server) dono isi ko
 * call karte hain, do baar chalne par duplicate enrollment nahi banta aur
 * password dobara reset nahi hota.
 */
export async function grantAccess(
  orderId: string,
  gatewayPaymentId?: string,
): Promise<{ newPassword: string | null }> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: { select: { id: true, passwordHash: true } } },
  });
  if (!order) return { newPassword: null };

  let newPassword: string | null = null;
  let passwordHash: string | undefined;

  // Pehli baar: auto account ke liye password banao.
  if (!order.user.passwordHash) {
    newPassword = generatePassword();
    passwordHash = await hashPassword(newPassword);
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: "paid",
        paidAt: order.paidAt ?? new Date(),
        ...(gatewayPaymentId ? { gatewayPaymentId } : {}),
      },
    });

    if (passwordHash) {
      await tx.user.update({ where: { id: order.userId }, data: { passwordHash } });
    }

    await tx.enrollment.upsert({
      where: { userId_courseId: { userId: order.userId, courseId: order.courseId } },
      create: { userId: order.userId, courseId: order.courseId, orderId: order.id },
      update: {},
    });
  });

  return { newPassword };
}
