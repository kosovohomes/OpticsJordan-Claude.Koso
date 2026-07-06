import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });
  return { title: t("meta.title"), description: t("meta.description") };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const t = await getTranslations({ locale, namespace: "Home" });

  // Fetch categories for display
  const categories = await prisma.category
    .findMany({ where: { isActive: true, parentId: null }, orderBy: { sortOrder: "asc" }, take: 4 })
    .catch(() => []);

  const categoryIcons: Record<string, string> = {
    eyeglasses: "👓",
    sunglasses: "🕶️",
    "contact-lenses": "👁️",
    accessories: "🧴",
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">{t("hero.subtitle")}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`/${locale}/shop/products`}
              className="rounded-full bg-gold-500 px-8 py-3 font-semibold text-brand-950 shadow-lg transition hover:bg-gold-400"
            >
              {t("hero.shopNow")}
            </a>
            <a
              href={`/${locale}/auth/sign-up`}
              className="rounded-full border border-white/30 px-8 py-3 font-semibold backdrop-blur-sm transition hover:bg-white/10"
            >
              {t("hero.register")}
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">{t("categories.title")}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.length > 0
            ? categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`/${locale}/shop/products?category=${cat.slug}`}
                  className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-brand-200 hover:shadow-md"
                >
                  <span className="mb-3 text-4xl">{categoryIcons[cat.slug] ?? "📦"}</span>
                  <span className="text-center text-sm font-medium text-gray-700">
                    {isAr ? cat.nameAr : cat.nameEn}
                  </span>
                </a>
              ))
            : (["eyeglasses", "sunglasses", "contact-lenses", "accessories"] as const).map(
                (slug) => (
                  <a
                    key={slug}
                    href={`/${locale}/shop/products?category=${slug}`}
                    className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-brand-200 hover:shadow-md"
                  >
                    <span className="mb-3 text-4xl">{categoryIcons[slug]}</span>
                    <span className="text-center text-sm font-medium text-gray-700">
                      {t(`categories.${slug}`)}
                    </span>
                  </a>
                )
              )}
        </div>
      </section>

      {/* B2B Banner */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-brand-950 px-8 py-10 text-white md:flex md:items-center md:justify-between md:px-12">
          <div>
            <h2 className="text-2xl font-bold">{t("b2b.title")}</h2>
            <p className="mt-2 text-blue-200">{t("b2b.subtitle")}</p>
          </div>
          <div className="mt-6 flex gap-4 md:mt-0">
            <a
              href={`/${locale}/auth/sign-up?role=SHOP_OWNER`}
              className="rounded-full bg-gold-500 px-6 py-3 font-semibold text-brand-950 hover:bg-gold-400"
            >
              {t("b2b.shopOwner")}
            </a>
            <a
              href={`/${locale}/auth/sign-up?role=SUPPLIER`}
              className="rounded-full border border-white/30 px-6 py-3 font-semibold hover:bg-white/10"
            >
              {t("b2b.supplier")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
