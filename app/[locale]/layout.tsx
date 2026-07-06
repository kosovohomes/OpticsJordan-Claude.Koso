import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Noto_Kufi_Arabic } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/lib/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const notoKufi = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-kufi",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "OpticsJordan | بصريات الأردن", template: "%s | OpticsJordan" },
  description: "Jordan's premier optics marketplace — نظارات، عدسات، ومستلزمات بصرية",
};

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "ar" | "en")) notFound();

  const messages = await getMessages();
  const isRTL = locale === "ar";

  return (
    <ClerkProvider>
      <html
        lang={locale}
        dir={isRTL ? "rtl" : "ltr"}
        className={`${inter.variable} ${notoKufi.variable}`}
        suppressHydrationWarning
      >
        <body className={isRTL ? "font-arabic" : "font-sans"}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Header locale={locale} />
            <main className="min-h-screen">{children}</main>
            <Footer locale={locale} />
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
