import SidebarLayout from "@/components/molecules/sidebar-layout";
import TableOfContents from "@/components/molecules/toc";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const SECTIONS = [
  { id: "introduction", title: "1. Introduction" },
  { id: "when-collect", title: "2. When will we collect data?" },
  { id: "what-collect", title: "3. What data will we collect?" },
];

export default function PrivacyPage() {
  const header = (
    <div className="bg-content/5 p-8 rounded-2xl border border-content/5 mb-10">
      <h1 className="text-3xl font-black text-content mb-2">Privacy Policy</h1>
      <p className="text-content/60 text-base">
        We are committed to protecting your personal information.
      </p>
    </div>
  );

  const sidebar = (
    <div>
      <h3 className="text-sm font-bold text-content/40 uppercase tracking-wider mb-3">
        Table of Contents
      </h3>
      <TableOfContents items={SECTIONS} />
    </div>
  );

  return (
    <SidebarLayout header={header} sidebar={sidebar}>
      <div className="space-y-12 text-content/80 leading-relaxed text-sm sm:text-base">
        <section id="introduction" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-content mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full"></span>
            1. INTRODUCTION
          </h2>
          <div className="space-y-3">
            <p>
              1.1. Welcome to the Shop.Hub platform (including website and
              mobile application) operated by Shop.Hub and its affiliates.
              Shop.Hub takes its responsibilities regarding information security
              seriously in accordance with the regulations on the protection of
              personal information privacy by law and is committed to respecting
              the privacy and concerns of all users.
            </p>
            <p>
              1.2. &quot;Personal Data&quot; or &quot;personal data&quot; means
              data, whether true or not, about an individual who can be
              identified from that data, or from that data and other information
              to which an organization has or is likely to have access.
            </p>
            <p>
              1.3. By using the Services, registering an account with us, or
              accessing the Platform, you acknowledge and agree that you accept
              the methods, requirements, and/or policies described in this
              Privacy Policy.
            </p>
          </div>
        </section>

        <section id="when-collect" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-content mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full"></span>
            2. WHEN WILL WE COLLECT DATA?
          </h2>
          <div className="space-y-3">
            <p>2.1. We will/may collect personal data about you:</p>
            <ul className="list-disc pl-5 space-y-1 text-content/70">
              <li>
                When you register and/or use our Services or Platform, or open
                an account with us;
              </li>
              <li>
                When you submit any form, including application forms or other
                forms related to any of our products and services;
              </li>
              <li>
                When you enter into any agreement or provide other documents or
                information related to your interaction with us.
              </li>
            </ul>
          </div>
        </section>

        <section id="what-collect" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-content mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full"></span>
            3. WHAT DATA WILL WE COLLECT?
          </h2>
          <div className="space-y-3">
            <p>
              3.1. The personal data that Shop.Hub may collect includes basic
              personal data and sensitive personal data such as: name, email
              address, date of birth, billing/shipping address, bank account and
              payment information, phone number, gender, and device information.
            </p>
          </div>
        </section>
      </div>
    </SidebarLayout>
  );
}
