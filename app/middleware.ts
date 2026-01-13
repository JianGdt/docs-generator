import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

// Define public routes that don't require authentication
const publicRoutes = ["/login", "/signup", "/"];
const authRoutes = ["/login", "/signup"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // If user is logged in and tries to access auth pages, redirect to dashboard
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // If user is not logged in and tries to access protected route, redirect to login
  if (!isPublicRoute && !isLoggedIn) {
    const callbackUrl = nextUrl.pathname + nextUrl.search;
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
