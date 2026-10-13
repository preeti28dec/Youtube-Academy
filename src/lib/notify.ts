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
    `Subject: ${args.courseTitle} — aapka account taiyaar hai`,
    ``,
    `Namaste ${args.name},`,
    `Payment successful. Login details:`,
    `  Login ID : ${args.email}`,
    `  Password : ${args.password}`,
    `Login karein aur password badal lein.`,
    `Koi dikkat ho to WhatsApp: +${env.whatsappNumber}`,
  ];
  console.log("\n[notify] ----- welcome message -----\n" + lines.join("\n") + "\n");
}
