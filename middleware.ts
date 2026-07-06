import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "/:locale/account(.*)",
  "/:locale/shop/orders(.*)",
  "/:locale/shop/cart/checkout(.*)",
  "/:locale/onboarding(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  if (isProtectedRoute(req) && !userId) {
    const locale = req.nextUrl.pathname.split("/")[1] ?? "ar";
    return Response.redirect(new URL(`/${locale}/auth/sign-in`, req.url));
  }
  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
