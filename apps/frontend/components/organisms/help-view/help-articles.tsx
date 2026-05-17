"use client";

import React from "react";
import Link from "next/link";
import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";

interface ArticleItem {
  title: string;
  views: string;
}

interface HelpArticlesProps {
  articles: ArticleItem[];
}

export function HelpArticles({
  articles,
}: HelpArticlesProps): React.ReactElement {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
      {/* Main Content (Popular Articles) */}
      <div className="lg:col-span-2">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-content">Popular Articles</h2>
          <Link
            href={APP_ROUTES.FAQ}
            className="text-sm font-medium text-primary hover:underline"
          >
            View More FAQ
          </Link>
        </div>
        <div className="divide-y divide-content/5 border-t border-b border-content/5">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <div
                key={index}
                className="py-4 flex justify-between items-center hover:bg-surface/30 px-2 -mx-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-content/40 text-sm font-medium">
                    0{index + 1}
                  </span>
                  <p className="text-sm font-medium text-content/80 hover:text-primary transition-colors">
                    {article.title}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-content/40 text-xs">
                  <span>👁️ {article.views}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-content/40">
              No matching articles found.
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Support Ticket */}
        <div className="border border-content/5 rounded-2xl p-6 bg-surface shadow-sm">
          <h3 className="text-lg font-bold text-content mb-2">Need Support?</h3>
          <p className="text-content/60 text-sm mb-4">
            Can&apos;t find what you need? Open a support ticket and we&apos;ll
            help you.
          </p>
          <Button variant="primary" size="sm" className="w-full">
            Open a Ticket
          </Button>
        </div>

        {/* Contact Support */}
        <div className="border border-content/5 rounded-2xl p-6 bg-surface shadow-sm">
          <h3 className="text-lg font-bold text-content mb-2">
            Direct Contact
          </h3>
          <p className="text-content/60 text-sm mb-4">
            Our team is available 24/7 for urgent matters.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            href={APP_ROUTES.CONTACT}
          >
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HelpArticles;
