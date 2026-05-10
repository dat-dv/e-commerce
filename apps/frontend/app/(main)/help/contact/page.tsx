import AppContainer from '@/components/atoms/app-container';
import Button from '@/components/atoms/button';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with our support team.',
};

export default function ContactPage() {
  return (
    <AppContainer
      size="2xl"
      className="py-12 animate-in fade-in slide-in-from-bottom-6 duration-700"
    >
      <div className="mb-8">
        <Link href="/help" className="text-primary text-sm font-medium hover:underline">
          ← Back to Help Center
        </Link>
        <h1 className="text-3xl font-black mt-2 text-content">Contact Us</h1>
        <p className="text-content/60 text-sm mt-1">We are here to help you 24/7.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Contact Form */}
        <div className="border border-content/5 rounded-2xl p-6 bg-surface shadow-sm">
          <h2 className="text-xl font-bold text-content mb-4">Send us a message</h2>
          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium text-content/80 block mb-1">Subject</label>
              <input
                type="text"
                placeholder="How can we help?"
                className="w-full h-10 px-4 rounded-xl bg-surface border border-content/10 focus:outline-none focus:border-primary transition-colors text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-content/80 block mb-1">Message</label>
              <textarea
                placeholder="Describe your issue in detail..."
                rows={4}
                className="w-full px-4 py-2 rounded-xl bg-surface border border-content/10 focus:outline-none focus:border-primary transition-colors text-sm"
              ></textarea>
            </div>
            <Button variant="primary" size="sm" className="w-full">
              Send Message
            </Button>
          </form>
        </div>

        {/* Direct Contact Info */}
        <div className="space-y-6">
          <div className="border border-content/5 rounded-2xl p-6 bg-surface shadow-sm">
            <h3 className="text-lg font-bold text-content mb-2">Direct Contact</h3>
            <p className="text-content/60 text-sm mb-4">
              Our team is available 24/7 for urgent matters.
            </p>
            <div className="space-y-2 text-sm text-content/80">
              <p>📧 <span className="font-medium">Email:</span> support@shop.hub</p>
              <p>📞 <span className="font-medium">Phone:</span> +1 (234) 567-890</p>
            </div>
          </div>

          <div className="border border-content/5 rounded-2xl p-6 bg-surface shadow-sm">
            <h3 className="text-lg font-bold text-content mb-2">Need Support?</h3>
            <p className="text-content/60 text-sm mb-4">
              Can&apos;t find what you need? Open a support ticket and we&apos;ll help you.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Open a Ticket
            </Button>
          </div>
        </div>
      </div>
    </AppContainer>
  );
}
