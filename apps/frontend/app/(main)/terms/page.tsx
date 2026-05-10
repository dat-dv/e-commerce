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
              1.1. Welcome to the Shop.Hub platform (including website and
              mobile application) operated by Shop.Hub and its affiliates. We
              take our responsibilities regarding information security seriously
              in accordance with the regulations on the protection of personal
              information privacy by law.
            </p>
            <p>
              1.2. By using the Services, registering an account with us, or
              accessing the Platform, you acknowledge and agree that you accept
              the methods, requirements, and/or policies described in this
              Policy.
            </p>
            <p>
              1.3. IF YOU DO NOT AGREE TO ALLOW THE PROCESSING OF YOUR PERSONAL
              DATA AS DESCRIBED IN THIS POLICY, PLEASE DO NOT USE OUR SERVICES
              OR ACCESS THE PLATFORM.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-content mb-3">
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

        <section>
          <h2 className="text-lg font-bold text-content mb-3">
            3. RIGHTS AND RESPONSIBILITIES
          </h2>
          <div className="space-y-3">
            <p>
              3.1. You agree not to provide us with any inaccurate or misleading
              information and you agree to notify us of any inaccurate
              information or when there are changes to information.
            </p>
            <p>
              3.2. We reserve the right, at our sole discretion, to request
              other necessary documents to verify any information provided by
              you.
            </p>
          </div>
        </section>
      </div>
    </AppContainer>
  );
}
