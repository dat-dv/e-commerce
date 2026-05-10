import AppContainer from "@/components/atoms/app-container";
import Button from "@/components/atoms/button";
import ContactForm from "@/components/molecules/contact-form";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with our support team.",
};

export default function ContactPage() {
  return (
    <AppContainer
      size="2xl"
      className="py-12 animate-in fade-in slide-in-from-bottom-6 duration-700"
    >
      <div className="mb-8">
        <Link
          href="/help"
          className="text-primary text-sm font-bold hover:underline inline-flex items-center gap-1"
        >
          ← Back to Help Center
        </Link>
        <h1 className="text-3xl font-black mt-2 text-content">Contact Us</h1>
        <p className="text-content/60 text-sm mt-1">
          We are here to help you 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Contact Form */}
        <div className="md:col-span-2 border border-content/5 rounded-2xl p-8 bg-surface shadow-sm">
          <h2 className="text-xl font-bold text-content mb-6">Send us a message</h2>
          <ContactForm />
        </div>

        {/* Direct Contact Info & Support */}
        <div className="flex flex-col gap-6 h-full">
          <div className="border border-content/5 rounded-2xl p-8 bg-surface shadow-sm flex-1">
            <h3 className="text-lg font-bold text-content mb-2">
              Direct Contact
            </h3>
            <p className="text-content/60 text-sm mb-4">
              Our team is available 24/7 for urgent matters.
            </p>
            <div className="space-y-2 text-sm text-content/80">
              <p>
                📧 <span className="font-medium">Email:</span> support@shop.hub
              </p>
              <p>
                📞 <span className="font-medium">Phone:</span> +1 (234) 567-890
              </p>
            </div>
          </div>

          <div className="border border-content/5 rounded-2xl p-8 bg-surface shadow-sm flex-1">
            <h3 className="text-lg font-bold text-content mb-2">
              Need Support?
            </h3>
            <p className="text-content/60 text-sm mb-4">
              Can&apos;t find what you need? Open a support ticket and
              we&apos;ll help you.
            </p>
            <Button
              variant="outline"
              size="md"
              className="w-full h-12 rounded-xl"
            >
              Open a Ticket
            </Button>
          </div>
        </div>
      </div>
    </AppContainer>
  );
}
