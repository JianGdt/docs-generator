import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export default async function proxy(req: NextRequest) {
  const session = await auth();

  const protectedRoutes = ["/dashboard", "/profile", "/settings", "/docs"];
  const publicRoutes = ["/login", "/signup", "/"];

  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPublicRoute = publicRoutes.includes(path);

  if (isProtectedRoute && !session?.user) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && session?.user && path === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
