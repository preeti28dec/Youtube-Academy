import { env } from "./env";

/**
 * Transactional email / WhatsApp hook.
 *
 * Abhi console par log hota hai taaki local par flow test ho sake.
 * Production mein isi function ke andar Brevo / Amazon SES ka API call
 * daalna hai — baaki code ko chhune ki zaroorat nahi.
 */
export async function sendWelcomeMessage(args: {
  name: string;
  email: string;
  mobile: string;
  password: string;
  courseTitle: string;
}): Promise<void> {
  const lines = [
    `To: ${args.email} / +91 ${args.mobile}`,
    `Subject: ${args.courseTitle} — your account is ready`,
    ``,
    `Hi ${args.name},`,
    `Payment successful. Your login details:`,
    `  Login ID : ${args.email}`,
    `  Password : ${args.password}`,
    `Log in and change this password.`,
    `Any trouble? WhatsApp us: +${env.whatsappNumber}`,
  ];
  console.log("\n[notify] ----- welcome message -----\n" + lines.join("\n") + "\n");
}
