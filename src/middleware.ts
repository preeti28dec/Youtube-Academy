import { NextResponse, type NextRequest } from "next/server";
import { dbConfigured } from "@/lib/db-url";
import { secretsConfigured } from "@/lib/env";

/**
 * Database configure na ho to har request /setup par chali jaati hai.
 *
 * Isse pehli baar deploy karte waqt site crash nahi karti — woh khud bata
 * deti hai ki kaunsa environment variable baaki hai. DATABASE_URL set hote
 * hi yeh middleware kuch nahi karta aur site normal chalne lagti hai.
 */
export function middleware(req: NextRequest) {
  if (dbConfigured() && secretsConfigured()) return NextResponse.next();

  // Setup page khud DB use nahi karta, isliye use rewrite se bahar rakhte hain.
  if (req.nextUrl.pathname === "/setup") return NextResponse.next();

  // API calls ko HTML page bhejna bekaar hai — unhe saaf JSON milta hai.
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "The server is not fully configured yet. See /setup." },
      { status: 503 },
    );
  }

  return NextResponse.rewrite(new URL("/setup", req.url));
}

export const config = {
  // Next ke apne assets aur icon ko chhodkar baaki sab.
  matcher: ["/((?!_next/static|_next/image|icon.svg|favicon.ico).*)"],
};
