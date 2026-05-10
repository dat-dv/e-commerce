import SidebarLayout from "@/components/molecules/sidebar-layout";
import TableOfContents from "@/components/molecules/toc";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

const SECTIONS = [
  { id: "introduction", title: "1. Introduction" },
  { id: "privacy", title: "2. Privacy" },
  { id: "liability", title: "3. Limitation of Liability" },
];

export default function TermsPage() {
  const header = (
    <div className="bg-gradient-to-br from-primary/10 via-transparent to-transparent p-10 rounded-3xl border border-content/5 relative overflow-hidden">
      <div className="relative z-10">
        <h1 className="text-4xl font-black text-content mb-2">
          Terms of Service
        </h1>
        <p className="text-content/60 text-lg">
          Please read these terms carefully before using our services.
        </p>
      </div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-primary/10 to-transparent -z-10" />
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
              1.1. Welcome to the Shop.Hub E-Commerce platform via website or
              mobile application (&quot;Shop.Hub Site&quot; or &quot;Shop.Hub
              Platform&quot;). Before using the Shop.Hub Site or creating a
              Shop.Hub account (&quot;Account&quot;), please read the following
              Terms of Service carefully and the Operation Regulations of the
              Shop.Hub E-Commerce Platform to understand your legal rights and
              obligations with respect to Shop.Hub and its affiliates and
              subsidiaries.
            </p>
            <p>
              1.2. The Services include an online platform service connecting
              consumers to provide business opportunities between buyers
              (&quot;Buyers&quot;) and sellers (&quot;Sellers&quot;). The actual
              sales contract is directly between the Buyer and the Seller.
            </p>
            <p>
              1.3. Before becoming a User of the Shop.Hub Site, you must read
              and accept all the terms and conditions defined in, and referenced
              to, this Terms of Service and the Privacy Policy.
            </p>
            <p>
              1.4. Shop.Hub reserves the right to change, modify, suspend or
              terminate all or any part of the Shop.Hub Site or Services at any
              time in accordance with legal regulations.
            </p>
            <p>
              1.5. Shop.Hub reserves the right to refuse requests to open an
              Account or your access to the Shop.Hub Site or Services in
              accordance with legal regulations and the Terms of Service.
            </p>
          </div>
        </section>

        <section id="privacy" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-content mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full"></span>
            2. PRIVACY
          </h2>
          <div className="space-y-3">
            <p>
              2.1. Shop.Hub takes your privacy seriously. To protect user
              rights, Shop.Hub provides a Privacy Policy to explain in detail
              Shop.Hub's privacy practices. Please refer to the Privacy Policy
              to know how Shop.Hub collects and uses information related to the
              Account and/or use of the Services of the User.
            </p>
          </div>
        </section>

        <section id="liability" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-content mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full"></span>
            3. LIMITATION OF LIABILITY
          </h2>
          <div className="space-y-3">
            <p>
              3.1. Shop.Hub grants the User the appropriate right to access and
              use the Services in accordance with the terms and conditions
              defined in this Terms of Service. All Content, trademarks, service
              marks, trade names, logos and other exclusive intellectual
              property displayed on the Shop.Hub Site are owned by Shop.Hub and
              third-party owners (if any).
            </p>
          </div>
        </section>
      </div>
    </SidebarLayout>
  );
}
