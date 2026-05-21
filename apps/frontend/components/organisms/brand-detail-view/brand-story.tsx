/* eslint-disable @next/next/no-img-element */
import { TYPOGRAPHY } from "@/constants/typography";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";

interface BrandStoryProps {
  brand: TBrand;
}

export function BrandStory({ brand }: BrandStoryProps) {
  const t = useTranslations("BrandsPage.detail.story");

  return (
    <section className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
      {/* Title Side */}
      <div className="flex flex-col gap-6 lg:col-span-5 lg:gap-8">
        <div className="flex items-center gap-4">
          <div className="bg-primary h-[1px] w-12" />
          <span
            className={`${TYPOGRAPHY.caption} text-primary font-black tracking-[0.4em] uppercase`}
          >
            {t("eyebrow")}
          </span>
        </div>

        <h2 className="text-content text-4xl leading-[0.95] font-black tracking-normal uppercase italic sm:text-5xl lg:text-6xl">
          {t("title")} <br />
          <span className="text-primary">{t("highlight")}</span>
        </h2>

        <div className="border-content/5 bg-content/[0.03] relative overflow-hidden rounded-2xl border p-5 sm:p-8 md:rounded-[2rem]">
          <Quote className="text-primary absolute -top-4 -left-4 h-24 w-24 opacity-5" />
          <p className="text-content/60 relative z-10 text-base leading-relaxed font-light italic sm:text-xl">
            &quot;
            {brand.description || t("fallbackQuote")}
            &quot;
          </p>
        </div>
      </div>

      {/* Content Side */}
      <div className="flex flex-col gap-8 lg:col-span-7 lg:gap-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <div className="flex flex-col gap-4">
            <span
              className={`${TYPOGRAPHY.badge} text-primary font-bold tracking-widest uppercase`}
            >
              {t("overviewTitle")}
            </span>
            <p className="text-content/70 leading-relaxed font-medium">
              {t("overviewDescription", { brand: brand.name })}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <span
              className={`${TYPOGRAPHY.badge} text-primary font-bold tracking-widest uppercase`}
            >
              {t("philosophyTitle")}
            </span>
            <p className="text-content/70 leading-relaxed font-medium">
              {t("philosophyDescription", { brand: brand.name })}
            </p>
          </div>
        </div>

        <div className="border-content/10 relative aspect-video overflow-hidden rounded-2xl border md:rounded-[3rem]">
          <img
            src={
              brand.bannerUrl ||
              "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
            }
            className="h-full w-full object-cover opacity-50 grayscale transition-all duration-1000 hover:grayscale-0"
            alt={t("imageAlt")}
          />
          <div className="from-background absolute inset-0 bg-gradient-to-t to-transparent" />
          <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
            <span className="text-content text-2xl font-black tracking-normal uppercase md:text-4xl">
              {t("imageCaption")}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <p className="text-content/60 text-base leading-relaxed sm:text-lg">
            {t("closingDescription", { brand: brand.name })}
          </p>
        </div>
      </div>
    </section>
  );
}
