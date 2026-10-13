import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getCurrentUser } from "@/lib/auth";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Sohail YouTube Academy",
  description:
    "YouTube Growth Masterclass — Hindi mein, mobile-friendly, lifetime access. Channel setup se monetization tak step-by-step.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-page">
        <Header user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton number={env.whatsappNumber} />
      </body>
    </html>
  );
}
