import { auth } from "./lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const path = nextUrl.pathname;

  if (["/login", "/register"].includes(path) && isLoggedIn) {
    return NextResponse.redirect(new URL("/docs-generator", nextUrl));
  }

  if (path.startsWith("/docs-generator") && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  if (path === "/" && isLoggedIn) {
    return NextResponse.redirect(new URL("/docs-generator", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
