import Button from "@/components/atoms/button";
import Accordion from "@/components/molecules/accordion";
import SidebarLayout from "@/components/molecules/sidebar-layout";
import TableOfContents from "@/components/molecules/toc";
import type { Metadata } from "next";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions.",
};

const FAQ_TOPICS = [
  {
    name: "General",
    faqs: [
      {
        q: "[Fraud Alert] Shopping safely on Shop.Hub",
        a: "Always check the seller ratings and never share your password or OTP.",
      },
      {
        q: "[Service] How to contact Shop.Hub Customer Service",
        a: "Go to Help Center > Contact Us or use the live chat feature.",
      },
    ],
  },
  {
    name: "Account & Security",
    faqs: [
      {
        q: "How do I reset my password?",
        a: 'Go to the Sign In page and click on "Forgot Password". Follow the instructions sent to your email.',
      },
      {
        q: "How do I change my email address?",
        a: "Go to Profile Settings > Account to update your email address.",
      },
    ],
  },
  {
    name: "Payments",
    faqs: [
      {
        q: "What payment methods are supported?",
        a: "We support credit/debit cards, bank transfers, and Cash on Delivery (CoD).",
      },
      {
        q: "How do I use a voucher?",
        a: "Enter the voucher code at the checkout page before making payment.",
      },
    ],
  },
  {
    name: "Shipping & Delivery",
    faqs: [
      {
        q: "How do I track my order?",
        a: 'You can track your order in the "My Orders" section by clicking on the order to see its status. The shipper will contact you when the order is being delivered.',
      },
      {
        q: "How can I change my shipping address?",
        a: "You can change your shipping address before the order is shipped. Contact support immediately.",
      },
    ],
  },
  {
    name: "Returns & Refunds",
    faqs: [
      {
        q: "What is the return policy?",
        a: "We offer a 30-day return policy for most items. Items must be in original condition.",
      },
      {
        q: "How long does a refund take?",
        a: "Refunds usually take 3-5 business days to process after the return is approved.",
      },
    ],
  },
];

export default function FAQPage() {
  const header = (
    <div className="mb-10">
      <Link
        href={APP_ROUTES.HELP}
        className="text-primary text-sm font-bold hover:underline inline-flex items-center gap-1"
      >
        ← Back to Help Center
      </Link>
      <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 mt-4">
        <h1 className="text-3xl font-black text-content mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-content/60 text-base">
          Find answers to common questions about using Shop.Hub.
        </p>
      </div>
    </div>
  );

  const tocItems = FAQ_TOPICS.map((topic) => ({
    id: topic.name.toLowerCase().replace(/\s+/g, "-"),
    title: topic.name,
  }));

  const sidebar = (
    <div>
      <h3 className="text-sm font-bold text-content/40 uppercase tracking-wider mb-3">
        Categories
      </h3>
      <TableOfContents items={tocItems} />
      <div className="border border-content/5 rounded-2xl p-5 bg-surface mt-6">
        <h3 className="text-base font-bold text-content mb-1">
          Still need help?
        </h3>
        <p className="text-content/60 text-xs mb-3">
          Can&apos;t find what you need?
        </p>
        <Button
          variant="primary"
          size="sm"
          className="w-full text-xs py-2 rounded-lg"
          href={APP_ROUTES.CONTACT}
        >
          Contact Us
        </Button>
      </div>
    </div>
  );

  return (
    <SidebarLayout header={header} sidebar={sidebar}>
      {/* Search inside FAQ */}
      <div className="mb-8">
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

      {/* Accordion List Grouped by Topic */}
      <div className="space-y-10">
        {FAQ_TOPICS.map((topic, index) => (
          <div
            key={index}
            id={topic.name.toLowerCase().replace(/\s+/g, "-")}
            className="scroll-mt-24"
          >
            <h2 className="text-xl font-bold text-content mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full"></span>
              {topic.name}
            </h2>
            <div className="space-y-3">
              {topic.faqs.map((faq, faqIndex) => (
                <Accordion key={faqIndex} title={faq.q}>
                  {faq.a}
                </Accordion>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SidebarLayout>
  );
}
