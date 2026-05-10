import AppContainer from "@/components/atoms/app-container";
import Button from "@/components/atoms/button";
import Accordion from "@/components/molecules/accordion";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions.",
};

const CATEGORIES = [
  "General",
  "Account & Security",
  "Payments",
  "Shipping & Delivery",
  "Returns & Refunds",
  "Promotions",
];

const FAQS = [
  {
    q: "How do I track my order?",
    a: 'You can track your order in the "My Orders" section by clicking on the order to see its status. The shipper will contact you when the order is being delivered.',
  },
  {
    q: "What is the return policy?",
    a: "We offer a 30-day return policy for most items. Items must be in original condition.",
  },
  {
    q: "How can I change my shipping address?",
    a: "You can change your shipping address before the order is shipped. Contact support immediately.",
  },
  {
    q: "How do I contact customer service?",
    a: "You can contact us via the Contact page or by opening a support ticket.",
  },
  {
    q: "[Fraud Alert] Shopping safely on Shop.Hub",
    a: "Always check the seller ratings and never share your password or OTP.",
  },
  {
    q: "[Service] How to contact Shop.Hub Customer Service",
    a: "Go to Help Center > Contact Us or use the live chat feature.",
  },
  {
    q: "How do I use a voucher?",
    a: "Enter the voucher code at the checkout page before making payment.",
  },
  {
    q: "How do I reset my password?",
    a: 'Go to the Sign In page and click on "Forgot Password". Follow the instructions sent to your email.',
  },
  {
    q: "What payment methods are supported?",
    a: "We support credit/debit cards, bank transfers, and Cash on Delivery (CoD).",
  },
  {
    q: "How long does a refund take?",
    a: "Refunds usually take 3-5 business days to process after the return is approved.",
  },
  {
    q: "Can I cancel my order?",
    a: "You can cancel your order before it is processed by the seller. Go to My Orders to cancel.",
  },
  {
    q: "How do I change my email address?",
    a: "Go to Profile Settings > Account to update your email address.",
  },
];

export default function FAQPage() {
  return (
    <AppContainer
      size="2xl"
      className="py-12 animate-in fade-in slide-in-from-bottom-6 duration-700"
    >
      {/* Header */}
      <div className="mb-12">
        <Link
          href="/help"
          className="text-primary text-sm font-bold hover:underline inline-flex items-center gap-1"
        >
          ← Back to Help Center
        </Link>
        <div className="mt-4 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-10 rounded-3xl border border-content/5 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-black text-content mb-2">
              Frequently Asked Questions
            </h1>
            <p className="text-content/60 text-lg">
              Find answers to common questions about using Shop.Hub.
            </p>
          </div>
          {/* Decorative background shape */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-primary/10 to-transparent -z-10" />
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar (Left) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-content/40 uppercase tracking-wider mb-3">
                Categories
              </h3>
              <ul className="space-y-1">
                {CATEGORIES.map((cat, index) => (
                  <li key={index}>
                    <button
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${index === 0 ? "bg-primary text-white" : "text-content/70 hover:bg-surface/80 hover:text-primary"}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Need Help Card in Sidebar */}
            <div className="border border-content/5 rounded-2xl p-5 bg-surface shadow-sm">
              <h3 className="text-base font-bold text-content mb-1">
                Still need help?
              </h3>
              <p className="text-content/60 text-xs mb-3">
                Can't find what you need?
              </p>
              <Button
                variant="primary"
                size="sm"
                className="w-full text-xs py-2 rounded-lg"
              >
                Open a Ticket
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content (Right) */}
        <div className="lg:col-span-3">
          {/* Search inside FAQ */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search FAQs..."
                className="w-full h-12 px-5 pl-12 rounded-2xl bg-surface border-2 border-content/5 focus:outline-none focus:border-primary transition-all text-sm shadow-sm"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-content/40">
                🔍
              </div>
            </div>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <Accordion key={index} title={faq.q}>
                {faq.a}
              </Accordion>
            ))}
          </div>
        </div>
      </div>
    </AppContainer>
  );
}
