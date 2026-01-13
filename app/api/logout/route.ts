import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(
    new URL("/login", process.env.NEXTAUTH_URL)
  );

  response.cookies.set("next-auth.session-token", "", { expires: new Date(0) });
  response.cookies.set("__Secure-next-auth.session-token", "", {
    expires: new Date(0),
  });
  response.cookies.set("next-auth.callback-url", "", { expires: new Date(0) });

  return response;
}
