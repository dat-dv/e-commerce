"use client";

import React, { useState, useMemo } from "react";
import AppContainer from "@/components/atoms/app-container";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";
import Fuse from "fuse.js";
import HelpHeader from "./help-header";
import HelpCategories from "./help-categories";
import HelpArticles from "./help-articles";

interface CategoryItem {
  emoji: string;
  title: string;
  desc: string;
  href: string;
}

interface ArticleItem {
  title: string;
  views: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    emoji: "🛍️",
    title: "Shopping",
    desc: "Orders, payments, and cancellations",
    href: "/help/faq",
  },
  {
    emoji: "🏷️",
    title: "Promotions",
    desc: "Vouchers, discounts, and coins",
    href: "/help/faq",
  },
  {
    emoji: "💳",
    title: "Payment",
    desc: "Methods, refunds, and security",
    href: "/help/faq",
  },
  {
    emoji: "📦",
    title: "Shipping",
    desc: "Tracking, delivery, and fees",
    href: "/help/shipping",
  },
  {
    emoji: "↩️",
    title: "Returns",
    desc: "Policies and return requests",
    href: "/help/faq",
  },
  {
    emoji: "ℹ️",
    title: "General",
    desc: "Account settings and safety",
    href: "/help/faq",
  },
];

const POPULAR_ARTICLES: ArticleItem[] = [
  { title: "[Fraud Alert] Shopping safely on Shop.Hub", views: "12.5k" },
  {
    title: "[Service] How to contact Shop.Hub Customer Service",
    views: "8.2k",
  },
  { title: "How do I track my order?", views: "24.1k" },
  { title: "What is the return policy?", views: "15.3k" },
  { title: "How do I use a voucher?", views: "9.7k" },
  { title: "What payment methods are supported?", views: "18.2k" },
];

export function HelpView(): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    const targetCats = CATEGORIES.filter((cat) =>
      ["Shopping", "Shipping", "General"].includes(cat.title),
    );
    if (!searchQuery.trim()) {
      return targetCats;
    }

    const fuse = new Fuse(CATEGORIES, {
      keys: ["title", "desc"],
      threshold: 0.4,
    });
    return fuse.search(searchQuery).map((r) => r.item);
  }, [searchQuery]);

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) {
      return POPULAR_ARTICLES;
    }

    const fuse = new Fuse(POPULAR_ARTICLES, {
      keys: ["title"],
      threshold: 0.4,
    });
    return fuse.search(searchQuery).map((r) => r.item);
  }, [searchQuery]);

  return (
    <div className="pb-24 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <HelpHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <AppContainer size="2xl">
        <HelpCategories categories={filteredCategories} />
        <HelpArticles articles={filteredArticles} />

        {/* Shipping FAQs Snippet */}
        <div id="shipping" className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-content">Shipping FAQs</h2>
            <Link
              href={APP_ROUTES.SHIPPING}
              className="text-sm font-medium text-primary hover:underline"
            >
              View More Shipping Info
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "How long does shipping take?",
                a: "Standard shipping usually takes 2-5 business days depending on your location.",
              },
              {
                q: "How do I track my order?",
                a: 'You can track your order in the "My Orders" section by clicking on the order to see its status. The shipper will contact you when the order is being delivered.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="border border-content/5 rounded-2xl p-6 bg-surface shadow-sm hover:border-primary/20 transition-colors"
              >
                <h3 className="text-base font-bold text-content mb-2">
                  {faq.q}
                </h3>
                <p className="text-content/60 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </AppContainer>
    </div>
  );
}

export default HelpView;
