import AppContainer from "@/components/atoms/app-container";
import Button from "@/components/atoms/button";
import Accordion from "@/components/molecules/accordion";
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
  return (
    <AppContainer
      size="2xl"
      className="py-12 animate-in fade-in slide-in-from-bottom-6 duration-700 scroll-smooth"
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
              Shipping Information
            </h1>
            <p className="text-content/60 text-lg">
              Find answers to questions about shipping and delivery.
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
                Topics
              </h3>
              <ul className="space-y-1">
                {SHIPPING_TOPICS.map((topic, index) => (
                  <li key={index}>
                    <Link
                      href={`#${topic.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className={`w-full block text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${index === 0 ? "bg-primary text-white" : "text-content/70 hover:bg-surface/80 hover:text-primary"}`}
                    >
                      {topic.name}
                    </Link>
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
        </div>
      </div>
    </AppContainer>
  );
}
