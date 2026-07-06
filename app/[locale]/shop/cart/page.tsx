type Props = { params: Promise<{ locale: string }> };
export default async function CartPage({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === "ar";
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center">
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-4xl">🛒</div>
      <h1 className="text-2xl font-bold text-gray-900">{isAr ? "سلة التسوق" : "Shopping Cart"}</h1>
      <p className="mt-2 text-gray-500">{isAr ? "سلتك فارغة" : "Your cart is empty"}</p>
      <a href={`/${locale}/shop/products`} className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700">
        {isAr ? "تسوق الآن" : "Shop Now"}
      </a>
    </div>
  );
}
