"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useState } from "react";

const OPTIONS = [
  { role: "CUSTOMER", icon: "🛍️", labelAr: "عميل", labelEn: "Customer", descAr: "تسوق للاستخدام الشخصي", descEn: "Shop for personal use" },
  { role: "SHOP_OWNER", icon: "🏪", labelAr: "صاحب متجر", labelEn: "Shop Owner", descAr: "أدِر متجرك على المنصة", descEn: "Manage your shop on the platform" },
  { role: "SUPPLIER", icon: "🚚", labelAr: "مورد", labelEn: "Supplier", descAr: "وفِّر منتجات بالجملة", descEn: "Supply wholesale products" },
];

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === "ar";
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!selected) return;
    setLoading(true);
    await fetch("/api/users/set-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: selected }),
    });
    await user?.reload();
    router.push(`/${locale}`);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600">
            <span className="text-2xl font-bold text-white">OJ</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAr ? `مرحباً، ${user?.firstName}!` : `Welcome, ${user?.firstName}!`}
          </h1>
          <p className="mt-2 text-gray-500">
            {isAr ? "كيف تريد استخدام بصريات الأردن؟" : "How would you like to use OpticsJordan?"}
          </p>
        </div>
        <div className="space-y-3">
          {OPTIONS.map((opt) => (
            <button
              key={opt.role}
              onClick={() => setSelected(opt.role)}
              className={`flex w-full items-center gap-4 rounded-2xl border-2 bg-white p-4 text-start transition ${selected === opt.role ? "border-brand-600 shadow-md" : "border-gray-200 hover:border-gray-300"}`}
            >
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-2xl">{opt.icon}</span>
              <div>
                <p className="font-semibold text-gray-900">{isAr ? opt.labelAr : opt.labelEn}</p>
                <p className="text-sm text-gray-500">{isAr ? opt.descAr : opt.descEn}</p>
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          className="mt-6 w-full rounded-xl bg-brand-600 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "متابعة" : "Continue")}
        </button>
      </div>
    </div>
  );
}
