import Button from "@/components/atoms/button";
import Accordion from "@/components/molecules/accordion";
import SidebarLayout from "@/components/molecules/sidebar-layout";
import TableOfContents from "@/components/molecules/toc";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping Information",
  description: "Learn about our shipping policies and tracking.",
};

const SHIPPING_TOPICS = [
  {
    name: "Shipping Methods",
    faqs: [
      {
        q: "Can I choose the shipping courier?",
        a: "Currently, we automatically select the best courier for your area to ensure the fastest delivery.",
      },
      {
        q: "Do you offer express shipping?",
        a: "Yes, express shipping is available for selected areas. You can choose it during checkout.",
      },
    ],
  },
  {
    name: "Order Tracking",
    faqs: [
      {
        q: "How do I track my order?",
        a: 'You can track your order in the "My Orders" section by clicking on the order to see its status. The shipper will contact you when the order is being delivered.',
      },
      {
        q: "Why is my tracking status not updating?",
        a: "It may take up to 24 hours for the courier to update the tracking status after pickup.",
      },
    ],
  },
  {
    name: "Shipping Fees",
    faqs: [
      {
        q: "How do I calculate shipping fees?",
        a: "Shipping fees are calculated automatically based on the distance from the seller and the weight of the items.",
      },
      {
        q: "How can I get free shipping?",
        a: "You can use free shipping vouchers or purchase from shops that offer free shipping promotions.",
      },
    ],
  },
  {
    name: "Delivery Times",
    faqs: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping usually takes 2-5 business days depending on your location.",
      },
      {
        q: "What if I am not home when the shipper arrives?",
        a: "The shipper will attempt to contact you. If unsuccessful, they will try again the next day. Maximum 3 attempts.",
      },
    ],
  },
  {
    name: "Lost Packages",
    faqs: [
      {
        q: "What happens if my package is lost?",
        a: "If your package is lost in transit, please contact support and we will investigate with the courier.",
      },
      {
        q: "What should I do if the package is damaged?",
        a: "Do not accept the package if it is heavily damaged. Take a photo and contact support immediately.",
      },
    ],
  },
  {
    name: "International Shipping",
    faqs: [
      {
        q: "Do you ship internationally?",
        a: "Currently, we only ship within the country. International shipping is not supported yet.",
      },
    ],
  },
];

export default function ShippingPage() {
  const header = (
    <div className="mb-10">
      <Link
        href="/help"
        className="text-primary text-sm font-bold hover:underline inline-flex items-center gap-1"
      >
        ← Back to Help Center
      </Link>
      <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 mt-4">
        <h1 className="text-3xl font-black text-content mb-2">
          Shipping Information
        </h1>
        <p className="text-content/60 text-base">
          Find answers to questions about shipping and delivery.
        </p>
      </div>
    </div>
  );

  const tocItems = SHIPPING_TOPICS.map((topic) => ({
    id: topic.name.toLowerCase().replace(/\s+/g, "-"),
    title: topic.name,
  }));

  const sidebar = (
    <div>
      <h3 className="text-sm font-bold text-content/40 uppercase tracking-wider mb-3">
        Topics
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
          href="/help/contact"
        >
          Contact Us
        </Button>
      </div>
    </div>
  );

  return (
    <SidebarLayout header={header} sidebar={sidebar}>
      {/* Search inside Shipping */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search shipping topics..."
            className="w-full h-12 px-5 pl-12 rounded-2xl bg-surface border-2 border-content/5 focus:outline-none focus:border-primary transition-all text-sm shadow-sm"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-content/40">
            🔍
          </div>
        </div>
      </div>

      {/* Accordion List Grouped by Topic */}
      <div className="space-y-10">
        {SHIPPING_TOPICS.map((topic, index) => (
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
