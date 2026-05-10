import AppContainer from "@/components/atoms/app-container";
import Button from "@/components/atoms/button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help Center",
  description: "How can we help you today?",
};

const CATEGORIES = [
  {
    emoji: "🛍️",
    title: "Shopping",
    desc: "Orders, payments, and cancellations",
  },
  { emoji: "🏷️", title: "Promotions", desc: "Vouchers, discounts, and coins" },
  { emoji: "💳", title: "Payment", desc: "Methods, refunds, and security" },
  { emoji: "📦", title: "Shipping", desc: "Tracking, delivery, and fees" },
  { emoji: "↩️", title: "Returns", desc: "Policies and return requests" },
  { emoji: "ℹ️", title: "General", desc: "Account settings and safety" },
];

const POPULAR_ARTICLES = [
  { title: "[Fraud Alert] Shopping safely on Shop.Hub", views: "12.5k" },
  {
    title: "[Service] How to contact Shop.Hub Customer Service",
    views: "8.2k",
  },
  { title: "How do I track my order?", views: "24.1k" },
];

export default function HelpPage() {
  return (
    <AppContainer
      size="2xl"
      className="py-12 animate-in fade-in slide-in-from-bottom-6 duration-700"
    >
      {/* Hero Section */}
      <div className="text-center mb-16 bg-gradient-to-br from-primary/5 via-transparent to-transparent p-12 rounded-3xl border border-content/5">
        <h1 className="text-4xl font-black mb-3 text-content">Help Center</h1>
        <p className="text-content/60 text-lg mb-8">
          Hello, how can we help you today?
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            placeholder="Enter keywords or search topics..."
            className="w-full h-14 px-6 pl-14 rounded-2xl bg-surface border-2 border-content/10 focus:outline-none focus:border-primary transition-all text-base shadow-sm"
          />
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-content/40 text-xl">
            🔍
          </div>
          <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-content">Browse Categories</h2>
          <span className="text-sm font-medium text-primary cursor-pointer hover:underline">
            View All
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, index) => (
            <div
              key={index}
              className="group border border-content/5 rounded-2xl p-6 flex flex-col items-start hover:border-primary/20 hover:bg-surface/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="text-4xl mb-4 p-3 bg-surface rounded-xl border border-content/5 group-hover:scale-110 transition-transform">
                {cat.emoji}
              </div>
              <h3 className="text-lg font-bold text-content mb-1">
                {cat.title}
              </h3>
              <p className="text-content/60 text-xs">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Articles & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        {/* Main Content (FAQs) */}
        <div id="faq" className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-content">
              Popular Articles
            </h2>
            <Link
              href="/help/faq"
              className="text-sm font-medium text-primary hover:underline"
            >
              View More FAQ
            </Link>
          </div>
          <div className="divide-y divide-content/5 border-t border-b border-content/5">
            {POPULAR_ARTICLES.map((article, index) => (
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
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Support Ticket */}
          <div className="border border-content/5 rounded-2xl p-6 bg-surface shadow-sm">
            <h3 className="text-lg font-bold text-content mb-2">
              Need Support?
            </h3>
            <p className="text-content/60 text-sm mb-4">
              Can&apos;t find what you need? Open a support ticket and
              we&apos;ll help you.
            </p>
            <Button variant="primary" size="sm" className="w-full">
              Open a Ticket
            </Button>
          </div>

          {/* Contact Support */}
          <div
            id="contact"
            className="border border-content/5 rounded-2xl p-6 bg-surface shadow-sm"
          >
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
              href="/help/contact"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>

      {/* Shipping FAQs Snippet */}
      <div id="shipping" className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-content">Shipping FAQs</h2>
          <Link
            href="/help/shipping"
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
              <h3 className="text-base font-bold text-content mb-2">{faq.q}</h3>
              <p className="text-content/60 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-content/40 text-xs">
        © 2026 Shop.Hub. All rights reserved.
      </div>
    </AppContainer>
  );
}
