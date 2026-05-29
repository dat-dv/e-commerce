"use client";

import { AppContainer } from "@ecommerce/ui";
import ContactForm from "@/components/molecules/contact-form";
import { HelpSupportCard } from "@ecommerce/ui";
import { APP_ROUTES } from "@/constants/routes";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

export function HelpContactView(): React.ReactElement {
  const t = useTranslations("HelpCenter.contact");

  return (
    <AppContainer
      size="2xl"
      className="animate-in fade-in slide-in-from-bottom-6 py-8 duration-700 sm:py-12"
    >
      <div className="mb-6 sm:mb-8">
        <Link
          href={APP_ROUTES.HELP}
          className="text-primary inline-flex items-center gap-1 text-sm font-bold hover:underline"
        >
          {t("backToHelp")}
        </Link>
        <h1 className="text-content mt-2 text-2xl font-black sm:text-3xl">
          {t("title")}
        </h1>
        <p className="text-content/60 mt-1 text-sm leading-6">
          {t("subtitle")}
        </p>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-6 lg:mb-12 lg:grid-cols-3 lg:gap-8">
        {/* Contact Form */}
        <div className="border-content/5 bg-surface rounded-2xl border p-5 shadow-sm sm:p-8 lg:col-span-2">
          <h2 className="text-content mb-5 text-lg font-bold sm:mb-6 sm:text-xl">
            {t("sendUsAMessage")}
          </h2>
          <ContactForm />
        </div>

        {/* Direct Contact Info & Support */}
        <div className="flex flex-col gap-6 self-start">
          <div className="border-content/5 bg-surface rounded-2xl border p-5 shadow-sm sm:p-8">
            <h3 className="text-content mb-2 text-lg font-bold">
              {t("directContact")}
            </h3>
            <p className="text-content/60 mb-4 text-sm leading-6">
              {t("directSupportNote")}
            </p>
            <div className="text-content/80 space-y-2 text-sm">
              <p className="break-words">
                📧 <span className="font-medium">{t("emailLabel")}:</span>{" "}
                support@Chot.Don
              </p>
              <p className="break-words">
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
            linkComponent={Link}
            className="rounded-2xl p-5 sm:p-8"
          />
        </div>
      </div>
    </AppContainer>
  );
}

export default HelpContactView;
