import { auth } from "../lib/auth";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  if (isAuthPage && session?.user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isAuthPage && !session?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
