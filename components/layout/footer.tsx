export function Footer({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  return (
    <footer className="bg-brand-950 px-4 py-10 text-center text-sm text-blue-300 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 font-bold text-white text-lg">
          {isAr ? "بصريات الأردن" : "OpticsJordan"}
        </p>
        <div className="mb-4 flex flex-wrap justify-center gap-6">
          {[
            { href: `/${locale}/shop/products`, label: isAr ? "المنتجات" : "Products" },
            { href: `/${locale}/auth/sign-up?role=SHOP_OWNER`, label: isAr ? "سجّل متجرك" : "Register Shop" },
            { href: `/${locale}/auth/sign-up?role=SUPPLIER`, label: isAr ? "انضم كمورد" : "Become Supplier" },
          ].map((l) => (
            <a key={l.href} href={l.href} className="hover:text-white transition">{l.label}</a>
          ))}
        </div>
        <p>© {new Date().getFullYear()} OpticsJordan · {isAr ? "جميع الحقوق محفوظة" : "All rights reserved"}</p>
      </div>
    </footer>
  );
}
