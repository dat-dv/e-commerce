"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { APP_ROUTES } from "@/constants/routes";
import { useTranslations } from "next-intl";

export default function Footer() {
  const pathname = usePathname();
  const t = useTranslations("Common.footer");

  const getLinkClass = (href: string) => {
    return `hover:text-primary cursor-pointer transition-colors ${
      pathname === href ? "text-primary font-bold" : ""
    }`;
  };

  const FOOTER_SECTIONS = [
    {
      title: t("categories"),
      links: [
        { label: t("allProducts"), href: APP_ROUTES.SEARCH },
        { label: t("featured"), href: APP_ROUTES.PRODUCTS },
        { label: t("newArrivals"), href: APP_ROUTES.NEW_ARRIVALS },
      ],
    },
    {
      title: t("support"),
      links: [
        { label: t("helpCenter"), href: APP_ROUTES.HELP },
        { label: t("contactUs"), href: APP_ROUTES.CONTACT },
        { label: t("faqs"), href: APP_ROUTES.FAQ },
        { label: t("shipping"), href: APP_ROUTES.SHIPPING },
      ],
    },
    {
      title: t("legal"),
      links: [
        { label: t("privacyPolicy"), href: APP_ROUTES.PRIVACY },
        { label: t("termsOfService"), href: APP_ROUTES.TERMS },
      ],
    },
  ];

  return (
    <footer className="py-10 border-t border-content/10 bg-surface mt-30">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-content/60">
        {FOOTER_SECTIONS.map((section) => (
          <div key={section.title}>
            <h3 className="font-bold text-content mb-3">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={getLinkClass(link.href)}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="font-bold text-content mb-3">{t("poweredBy")}</h3>
          <p className="font-medium text-primary">datdoan.dev@gmail.com</p>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-content/5 text-center text-xs text-content/40">
        © {new Date().getFullYear()} Shop.hub. {t("rightsReserved")}
      </div>
    </footer>
  );
}
