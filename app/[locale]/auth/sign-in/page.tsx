import { SignIn } from "@clerk/nextjs";
type Props = { params: Promise<{ locale: string }> };
export default async function SignInPage({ params }: Props) {
  const { locale } = await params;
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600">
            <span className="text-lg font-bold text-white">OJ</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === "ar" ? "تسجيل الدخول" : "Sign In"}
          </h1>
        </div>
        <SignIn
          appearance={{ elements: { formButtonPrimary: "bg-brand-600 hover:bg-brand-700" } }}
          redirectUrl={`/${locale}`}
          signUpUrl={`/${locale}/auth/sign-up`}
        />
      </div>
    </div>
  );
}
