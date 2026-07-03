import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAppRoute = req.nextUrl.pathname.startsWith("/app");

  if (isAppRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/app/:path*"],
};
