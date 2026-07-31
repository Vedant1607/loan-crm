import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  // Public routes — always accessible
  // Public routes — always accessible
  const publicRoutes = ["/login", "/verify-otp", "/api/auth"];
  const isPublicRoute = pathname === "/" || publicRoutes.some((r) => pathname.startsWith(r));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Not logged in — redirect to login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based route guards
  if (pathname.startsWith("/admin") && role !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (
    pathname.startsWith("/lender") &&
    role !== "LOAN_OFFICER" &&
    role !== "LENDER_ADMIN" &&
    role !== "SUPER_ADMIN"
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand|partners).*)"],
};