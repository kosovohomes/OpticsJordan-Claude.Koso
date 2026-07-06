import { SignUp } from "@clerk/nextjs";
type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ role?: string }> };
export default async function SignUpPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { role } = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600">
            <span className="text-lg font-bold text-white">OJ</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === "ar" ? "إنشاء حساب" : "Create Account"}
          </h1>
        </div>
        <SignUp
          appearance={{ elements: { formButtonPrimary: "bg-brand-600 hover:bg-brand-700" } }}
          unsafeMetadata={{ intendedRole: role ?? "CUSTOMER" }}
          redirectUrl={`/${locale}`}
          signInUrl={`/${locale}/auth/sign-in`}
        />
      </div>
    </div>
  );
}
