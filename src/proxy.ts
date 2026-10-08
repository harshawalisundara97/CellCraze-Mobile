import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

// Auth redirects + security headers. Reading the JWT with getToken is
// edge-safe (no Prisma adapter — that is what broke the old `auth()`-based
// middleware). Route handlers still verify the session server-side; this is
// the gate for page navigations.
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const secureCookie =
    req.nextUrl.protocol === "https:" ||
    req.headers.get("x-forwarded-proto") === "https";
  const token = await getToken({ req, secret, secureCookie });
  const isLoggedIn = !!token;
  const role = (token as { role?: string } | null)?.role;

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (pathname.startsWith("/account") || pathname.startsWith("/checkout")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    "/checkout/:path*",
    "/api/admin/:path*",
    "/api/orders/:path*",
    "/api/addresses/:path*",
  ],
};
