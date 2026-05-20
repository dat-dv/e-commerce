"use client";

import { APP_ROUTES } from "@/constants/routes";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <footer className="mt-16 border-t border-content/10 bg-surface py-7 sm:mt-24 sm:py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-5 gap-y-7 px-4 text-sm text-content/60 sm:grid-cols-2 sm:px-6 md:grid-cols-4 md:gap-8">
        {FOOTER_SECTIONS.map((section) => (
          <section key={section.title} className="min-w-0">
            <h3 className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-content sm:mb-3 sm:text-sm sm:normal-case sm:tracking-normal">
              {section.title}
            </h3>
            <ul className="-mx-2 space-y-0.5 sm:mx-0 sm:space-y-2">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`${getLinkClass(link.href)} block rounded-md px-2 py-1.5 text-xs leading-snug hover:bg-content/[0.04] sm:inline sm:rounded-none sm:px-0 sm:py-0 sm:text-sm sm:hover:bg-transparent`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="col-span-2 min-w-0 border-t border-content/5 pt-5 sm:col-span-1 sm:border-t-0 sm:pt-0">
          <h3 className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-content sm:mb-3 sm:text-sm sm:normal-case sm:tracking-normal">
            {t("poweredBy")}
          </h3>
          <p className="break-words text-sm font-bold text-primary">
            datdoan.dev@gmail.com
          </p>
        </section>
      </div>
      <div className="mx-4 mt-7 border-t border-content/5 pt-5 text-center text-[11px] leading-relaxed text-content/40 sm:mx-6 sm:mt-10 sm:pt-6 sm:text-xs">
        © {new Date().getFullYear()} Shop.hub. {t("rightsReserved")}
      </div>
    </footer>
  );
}
