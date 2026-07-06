import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; brand?: string; q?: string; page?: string; sort?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "ar" ? "المنتجات" : "Products" };
}

const PAGE_SIZE = 20;

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const isAr = locale === "ar";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));

  const where = {
    status: "ACTIVE" as const,
    isWholesale: false,
    ...(sp.category ? { category: { slug: sp.category } } : {}),
    ...(sp.brand ? { brand: { slug: sp.brand } } : {}),
    ...(sp.q
      ? {
          OR: [
            { nameAr: { contains: sp.q, mode: "insensitive" as const } },
            { nameEn: { contains: sp.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const orderBy =
    sp.sort === "price_asc"
      ? { price: "asc" as const }
      : sp.sort === "price_desc"
        ? { price: "desc" as const }
        : { createdAt: "desc" as const };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: true, brand: true },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { isActive: true, parentId: null }, orderBy: { sortOrder: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {isAr ? "المنتجات" : "Products"}
          <span className="ms-2 text-sm font-normal text-gray-500">({total})</span>
        </h1>
        {/* Search */}
        <form method="GET" className="flex gap-2">
          <input
            name="q"
            defaultValue={sp.q}
            placeholder={isAr ? "ابحث..." : "Search..."}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
          <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700">
            {isAr ? "بحث" : "Search"}
          </button>
        </form>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden w-48 flex-shrink-0 lg:block">
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">{isAr ? "الفئة" : "Category"}</h3>
            <ul className="space-y-1">
              <li>
                <a href={`/${locale}/shop/products`} className={`text-sm ${!sp.category ? "font-semibold text-brand-600" : "text-gray-600 hover:text-gray-900"}`}>
                  {isAr ? "الكل" : "All"}
                </a>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <a
                    href={`/${locale}/shop/products?category=${c.slug}`}
                    className={`text-sm ${sp.category === c.slug ? "font-semibold text-brand-600" : "text-gray-600 hover:text-gray-900"}`}
                  >
                    {isAr ? c.nameAr : c.nameEn}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700">{isAr ? "الترتيب" : "Sort"}</h3>
            <ul className="space-y-1">
              {[
                { val: "", label: isAr ? "الأحدث" : "Newest" },
                { val: "price_asc", label: isAr ? "السعر: من الأقل" : "Price: Low" },
                { val: "price_desc", label: isAr ? "السعر: من الأعلى" : "Price: High" },
              ].map((o) => (
                <li key={o.val}>
                  <a
                    href={`/${locale}/shop/products?${sp.category ? `category=${sp.category}&` : ""}sort=${o.val}`}
                    className={`text-sm ${(sp.sort ?? "") === o.val ? "font-semibold text-brand-600" : "text-gray-600 hover:text-gray-900"}`}
                  >
                    {o.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-xl">🔍</p>
              <p className="mt-4 text-gray-500">{isAr ? "لا توجد نتائج" : "No results found"}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => {
                const name = isAr ? product.nameAr : product.nameEn;
                const price = Number(product.price);
                const comparePrice = product.comparePrice ? Number(product.comparePrice) : null;
                const discount = comparePrice && comparePrice > price
                  ? Math.round(((comparePrice - price) / comparePrice) * 100)
                  : null;
                return (
                  <a
                    key={product.id}
                    href={`/${locale}/shop/products/${product.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="relative flex aspect-square items-center justify-center bg-gray-50 text-5xl">
                      {product.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.images[0]} alt={name} className="h-full w-full object-contain p-3" />
                      ) : (
                        "📦"
                      )}
                      {discount && (
                        <span className="absolute start-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                          -{discount}%
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-3">
                      {product.brand && (
                        <p className="mb-1 text-xs font-medium text-brand-600">
                          {isAr ? product.brand.nameAr : product.brand.nameEn}
                        </p>
                      )}
                      <p className="flex-1 text-sm font-medium leading-snug text-gray-900 line-clamp-2">{name}</p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-bold text-gray-900">{formatPrice(price, locale)}</span>
                        {comparePrice && (
                          <span className="text-xs text-gray-400 line-through">{formatPrice(comparePrice, locale)}</span>
                        )}
                      </div>
                      <p className={`mt-1 text-xs font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                        {product.stock > 0 ? (isAr ? "متوفر" : "In Stock") : (isAr ? "نفذت الكمية" : "Out of Stock")}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {page > 1 && (
                <a href={`?page=${page - 1}`} className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
                  {isAr ? "السابق" : "Previous"}
                </a>
              )}
              <span className="px-4 py-2 text-sm text-gray-500">{page} / {totalPages}</span>
              {page < totalPages && (
                <a href={`?page=${page + 1}`} className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
                  {isAr ? "التالي" : "Next"}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
