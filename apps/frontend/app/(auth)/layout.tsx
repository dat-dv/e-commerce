import { getTranslations } from "next-intl/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = await getTranslations("AuthLayout");
  return (
    <div className="bg-surface relative flex min-h-screen overflow-hidden">
      {/* Left side: branding/visuals - Hidden on mobile */}
      <div className="bg-primary/5 relative hidden flex-1 flex-col items-center justify-center overflow-hidden p-12 lg:flex">
        {/* Background Ambient Glows */}
        <div className="bg-primary/20 pointer-events-none absolute top-[-10%] left-[-10%] h-[80%] w-[80%] rounded-full blur-[180px]" />
        <div className="bg-secondary/10 pointer-events-none absolute right-[-10%] bottom-[-10%] h-[60%] w-[60%] rounded-full blur-[140px]" />

        <div className="relative z-10 max-w-md text-center">
          <Link href="/">
            <h1 className="from-primary to-primary/60 mb-6 cursor-pointer bg-gradient-to-r bg-clip-text text-5xl font-black tracking-tighter text-transparent transition-opacity hover:opacity-80">
              Chot.Don
            </h1>
          </Link>
          <p className="text-content/60 text-lg leading-relaxed font-medium">
            {t("description")}
          </p>
        </div>

        {/* Decorative Grid SVG */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />
      </div>

      {/* Right side: the form */}
      <div className="bg-surface relative z-10 flex flex-1 flex-col items-center justify-center p-8 sm:p-12">
        <div className="absolute top-8 right-8">
          <Link
            href="/"
            className="text-content/60 hover:text-primary text-sm font-medium transition-colors"
          >
            ← {t("backToHome")}
          </Link>
        </div>
        <div className="flex w-full max-w-md flex-col items-center">
          <div className="animate-in fade-in slide-in-from-right-8 flex w-full flex-col items-center duration-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
