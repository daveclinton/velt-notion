import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = getCurrentUser();
  const publicRoutes = [
    "/",
    "/sign-in",
    "/sign-up",
    "/api/(.*)",
    "/_next/(.*)",
    "/static/(.*)",
    "/favicon.ico",
  ];

  const isPublicRoute = publicRoutes.some((route) => {
    const regex = new RegExp(`^${route}$`);
    return regex.test(pathname);
  });

  if (pathname.startsWith("/documents") && !isPublicRoute) {
    // if (!user) {
    //   const signInUrl = new URL("/sign-in", request.url);
    //   signInUrl.searchParams.set("redirect", pathname);
    //   return NextResponse.redirect(signInUrl);
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply to all routes except Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Include API routes
    "/(api|trpc)(.*)",
  ],
};
