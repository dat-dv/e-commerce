import React from "react";
import AppContainer from "@/components/atoms/app-container";
import ContactForm from "@/components/molecules/contact-form";
import HelpSupportCard from "@/components/molecules/help-support-card";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";

export function HelpContactView(): React.ReactElement {
  return (
    <AppContainer
      size="2xl"
      className="py-12 animate-in fade-in slide-in-from-bottom-6 duration-700"
    >
      <div className="mb-8">
        <Link
          href={APP_ROUTES.HELP}
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
          <h2 className="text-xl font-bold text-content mb-6">
            Send us a message
          </h2>
          <ContactForm />
        </div>

        {/* Direct Contact Info & Support */}
        <div className="flex flex-col gap-6 self-start">
          <div className="border border-content/5 rounded-2xl p-8 bg-surface shadow-sm">
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

          <HelpSupportCard
            title="Need Support?"
            description="Can't find what you need? Open a support ticket and we'll help you."
            ctaLabel="Open a Ticket"
            showCta
            ctaHref={APP_ROUTES.CONTACT}
            className="p-8 rounded-2xl"
          />
        </div>
      </div>
    </AppContainer>
  );
}

export default HelpContactView;
