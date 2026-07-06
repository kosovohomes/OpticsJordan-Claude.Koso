import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = await prisma.product.findUnique({ where: { slug }, select: { nameAr: true, nameEn: true } });
  if (!p) return { title: "Not Found" };
  return { title: locale === "ar" ? p.nameAr : p.nameEn };
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  const isAr = locale === "ar";

  const product = await prisma.product.findUnique({
    where: { slug, status: "ACTIVE" },
    include: { category: true, brand: true, variants: true },
  });
  if (!product) notFound();

  const name = isAr ? product.nameAr : product.nameEn;
  const description = isAr ? product.descriptionAr : product.descriptionEn;
  const price = Number(product.price);
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <a href={`/${locale}`} className="hover:text-gray-900">{isAr ? "الرئيسية" : "Home"}</a>
        <span>/</span>
        <a href={`/${locale}/shop/products`} className="hover:text-gray-900">{isAr ? "المنتجات" : "Products"}</a>
        <span>/</span>
        <span className="text-gray-900">{name}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-2xl bg-gray-50 text-8xl">
          {product.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={name} className="h-full w-full rounded-2xl object-contain p-8" />
          ) : "👓"}
        </div>
        <div className="flex flex-col gap-4">
          {product.brand && (
            <p className="text-sm font-semibold text-brand-600">
              {isAr ? product.brand.nameAr : product.brand.nameEn}
            </p>
          )}
          <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-gray-900">{formatPrice(price, locale)}</span>
            {comparePrice && (
              <span className="text-lg text-gray-400 line-through">{formatPrice(comparePrice, locale)}</span>
            )}
          </div>
          <p className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
            {product.stock > 0
              ? (isAr ? `متوفر (${product.stock})` : `In Stock (${product.stock})`)
              : (isAr ? "نفذت الكمية" : "Out of Stock")}
          </p>
          {description && <p className="text-gray-600 leading-relaxed">{description}</p>}
          <button
            disabled={product.stock === 0}
            className="mt-2 w-full rounded-xl bg-brand-600 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAr ? "أضف للسلة" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
