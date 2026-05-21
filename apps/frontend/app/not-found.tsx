import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";

export async function generateMetadata() {
  const t = await getTranslations("Common.notFoundPage");
  return {
    title: t("metadataTitle"),
  };
}

export default async function NotFound() {
  const t = await getTranslations("Common.notFoundPage");

  return (
    <div className="bg-surface selection:bg-primary/30 relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
      {/* Background Decor */}
      <div className="bg-primary/10 pointer-events-none absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[160px]" />
      <div className="bg-secondary/10 pointer-events-none absolute top-[20%] right-[10%] h-[300px] w-[300px] rounded-full opacity-40 blur-[120px]" />

      <div className="animate-in fade-in slide-in-from-bottom-8 relative z-10 flex max-w-lg flex-col items-center text-center duration-700">
        <div className="relative mb-12">
          <h1 className="from-primary to-primary/20 bg-gradient-to-b bg-clip-text text-[180px] leading-none font-black tracking-tighter text-transparent opacity-20 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-surface/40 border-content/5 rounded-[48px] border p-8 shadow-2xl backdrop-blur-3xl">
              <span className="text-5xl">🔭</span>
            </div>
          </div>
        </div>

        <h2 className="mb-4 text-4xl font-bold tracking-tight">{t("title")}</h2>
        <p className="text-content/60 mb-12 text-lg leading-relaxed font-medium">
          {t("description")}
        </p>

        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <Link href={APP_ROUTES.HOME} className="flex-1">
            <Button
              variant="primary"
              size="lg"
              className="w-full rounded-[24px]"
            >
              <MoveLeft className="mr-2 h-5 w-5" />
              {t("returnHome")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
