import AppContainer from "@/components/atoms/app-container";

export const metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <AppContainer
      size="2xl"
      className="py-16 animate-in fade-in slide-in-from-bottom-6 duration-700"
    >
      <h1 className="text-3xl font-black mb-2 text-content">
        Terms of Service
      </h1>
      <p className="text-content/40 text-sm mb-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="space-y-8 text-content/80 leading-relaxed text-sm sm:text-base">
        <section>
          <h2 className="text-lg font-bold text-content mb-3">
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

        <section>
          <h2 className="text-lg font-bold text-content mb-3">2. PRIVACY</h2>
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

        <section>
          <h2 className="text-lg font-bold text-content mb-3">
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
    </AppContainer>
  );
}
