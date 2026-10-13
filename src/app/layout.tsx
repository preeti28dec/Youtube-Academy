import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getCurrentUser } from "@/lib/auth";
import { env } from "@/lib/env";
import { getDictionary } from "@/i18n";

export const metadata: Metadata = {
  title: "Sohail YouTube Academy",
  description:
    "YouTube Growth Masterclass — in Hindi, mobile-friendly, lifetime access. From channel setup to monetization, step by step.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * Har page session aur DB par depend karta hai, isliye kuch bhi build ke waqt
 * prerender nahi hona chahiye. Yeh layout config saare child routes par lagti
 * hai — iske bina Next kabhi-kabhi page ko static maan kar build par hi DB
 * query chala deta hai, jo hosting par (jahan DB abhi juda na ho) build tod
 * deti hai.
 */
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const d = getDictionary();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-page">
        <Header user={user} nav={d.nav} siteName={d.meta.siteName} tagline={d.meta.tagline} />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton number={env.whatsappNumber} />
      </body>
    </html>
  );
}
