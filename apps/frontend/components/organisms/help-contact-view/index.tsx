import React from "react";
import AppContainer from "@/components/atoms/app-container";
import ContactForm from "@/components/molecules/contact-form";
import HelpSupportCard from "@/components/molecules/help-support-card";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";
import { useTranslations } from "next-intl";

export function HelpContactView(): React.ReactElement {
  const t = useTranslations("HelpCenter.contact");

  return (
    <AppContainer
      size="2xl"
      className="py-12 animate-in fade-in slide-in-from-bottom-6 duration-700"
    >
      <div className="mb-8">
        <Link
          href={APP_ROUTES.HELP}
          className="text-primary text-sm font-bold hover:underline inline-flex items-center gap-1"
        >
          {t("backToHelp")}
        </Link>
        <h1 className="text-3xl font-black mt-2 text-content">{t("title")}</h1>
        <p className="text-content/60 text-sm mt-1">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Contact Form */}
        <div className="md:col-span-2 border border-content/5 rounded-2xl p-8 bg-surface shadow-sm">
          <h2 className="text-xl font-bold text-content mb-6">
            {t("sendUsAMessage")}
          </h2>
          <ContactForm />
        </div>

        {/* Direct Contact Info & Support */}
        <div className="flex flex-col gap-6 self-start">
          <div className="border border-content/5 rounded-2xl p-8 bg-surface shadow-sm">
            <h3 className="text-lg font-bold text-content mb-2">
              {t("directContact")}
            </h3>
            <p className="text-content/60 text-sm mb-4">
              {t("directSupportNote")}
            </p>
            <div className="space-y-2 text-sm text-content/80">
              <p>
                📧 <span className="font-medium">{t("emailLabel")}:</span>{" "}
                support@shop.hub
              </p>
              <p>
                📞 <span className="font-medium">{t("phoneLabel")}:</span> +1
                (234) 567-890
              </p>
            </div>
          </div>

          <HelpSupportCard
            title={t("needSupport")}
            description={t("needSupportDesc")}
            ctaLabel={t("openATicket")}
            showCta
            ctaHref={APP_ROUTES.CONTACT}
            className="p-8 rounded-2xl"
          />
        </div>
      </div>
    </AppContainer>
  );
}

export default HelpContactView;
