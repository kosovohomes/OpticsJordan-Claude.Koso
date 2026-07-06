import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ShoppingCart, Globe } from "lucide-react";

export function Header({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  const alt = locale === "ar" ? "en" : "ar";
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href={`/${locale}`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
            <span className="text-xs font-bold text-white">OJ</span>
          </div>
          <span className="hidden font-bold text-gray-900 sm:block">
            {isAr ? "بصريات الأردن" : "OpticsJordan"}
          </span>
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          <a href={`/${locale}/shop/products`} className="text-sm text-gray-600 hover:text-brand-700">
            {isAr ? "المنتجات" : "Products"}
          </a>
          <a href={`/${locale}/shop/products?category=eyeglasses`} className="text-sm text-gray-600 hover:text-brand-700">
            {isAr ? "نظارات" : "Eyeglasses"}
          </a>
          <a href={`/${locale}/shop/products?category=contact-lenses`} className="text-sm text-gray-600 hover:text-brand-700">
            {isAr ? "عدسات" : "Lenses"}
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <a href={`/${alt}`} className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-gray-600 hover:bg-gray-100">
            <Globe className="h-4 w-4" />
            {alt === "ar" ? "العربية" : "English"}
          </a>
          <a href={`/${locale}/shop/cart`} className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100">
            <ShoppingCart className="h-5 w-5" />
          </a>
          <SignedIn>
            <UserButton afterSignOutUrl={`/${locale}`} />
          </SignedIn>
          <SignedOut>
            <a href={`/${locale}/auth/sign-in`} className="text-sm font-medium text-gray-700 hover:text-brand-600">
              {isAr ? "دخول" : "Sign in"}
            </a>
            <a href={`/${locale}/auth/sign-up`} className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700">
              {isAr ? "تسجيل" : "Sign up"}
            </a>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
