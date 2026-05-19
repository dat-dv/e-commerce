"use client";

import AppContainer from "@/components/atoms/app-container";
import Button from "@/components/atoms/button";
import helpData from "@/app/(main)/(localized)/_data/help.json";
import { APP_ROUTES } from "@/constants/routes";
import { useLocale } from "next-intl";
import Link from "next/link";
import {
  ArrowRight,
  Headphones,
  MessageCircle,
  PackageCheck,
  PackageSearch,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import HelpHeader from "./help-header";

const iconMap = {
  "message-circle": MessageCircle,
  "package-check": PackageCheck,
  "package-search": PackageSearch,
  "receipt-text": ReceiptText,
  "rotate-ccw": RotateCcw,
  "shield-check": ShieldCheck,
  truck: Truck,
};

const hrefMap = {
  contact: APP_ROUTES.CONTACT,
  faq: APP_ROUTES.FAQ,
  orders: APP_ROUTES.ORDERS,
  shipping: APP_ROUTES.SHIPPING,
};

type IconName = keyof typeof iconMap;
type HrefKey = keyof typeof hrefMap;

export function HelpView(): React.ReactElement {
  const locale = useLocale();
  const lang = locale === "vi" ? "vi" : "en";
  const t = helpData.help[lang];
  const [query, setQuery] = useState("");

  const filteredCards = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return t.cards;

    return t.cards.filter((item) =>
      [item.title, item.desc, ...item.tags]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, t.cards]);

  return (
    <div className="pb-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <HelpHeader searchQuery={query} setSearchQuery={setQuery} />

      <AppContainer size="2xl" className="py-10">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-content">{t.quick}</h2>
                <p className="mt-2 text-sm leading-6 text-content/55">
                  {t.supportNote}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {filteredCards.map((item) => {
                const Icon = iconMap[item.icon as IconName];
                return (
                  <Link
                    key={item.title}
                    href={hrefMap[item.href as HrefKey]}
                    className="group flex min-w-0 items-center gap-4 rounded-lg border border-content/5 bg-surface p-4 shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-black text-content">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-content/60">
                        {item.desc}
                      </span>
                    </span>
                    <ArrowRight
                      className="size-4 shrink-0 text-content/30 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </div>
            {!filteredCards.length && (
              <p className="mt-6 rounded-lg border border-content/5 bg-surface p-6 text-sm text-content/55">
                {t.noResults}
              </p>
            )}
          </div>

          <aside className="self-start rounded-lg border border-content/5 bg-surface p-5 shadow-sm">
            <Headphones className="size-6 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-black text-content">
              {t.contactTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-content/60">
              {t.contactDesc}
            </p>
            <Button
              href={APP_ROUTES.CONTACT}
              variant="primary"
              size="lg"
              className="mt-5 w-full"
            >
              {t.contactCta}
            </Button>
          </aside>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-black text-content">{t.popular}</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {t.answers.map((answer, index) => (
              <Link
                key={answer}
                href={APP_ROUTES.FAQ}
                className="flex min-w-0 items-center gap-4 rounded-lg border border-content/5 bg-surface px-4 py-3 text-sm font-bold text-content/75 transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 break-words">{answer}</span>
              </Link>
            ))}
          </div>
        </section>
      </AppContainer>
    </div>
  );
}

export default HelpView;
