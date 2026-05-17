import { AnimationContainer, AnimationItem } from "@/components/atoms/animate";
import AppContainer from "@/components/atoms/app-container";
import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import { motion } from "framer-motion";

interface HomeHeroSectionProps {
  name?: string;
}

export default function HomeHeroSection({ name }: HomeHeroSectionProps) {
  const isLoggedIn = !!name;

  return (
    <section className="relative mb-8 min-h-[420px] flex items-center overflow-hidden border-b border-content/[0.03]">
      {/* ...background */}

      <AppContainer className="relative z-10 w-full py-16">
        <AnimationContainer className="max-w-3xl flex flex-col items-start gap-5">
          <AnimationItem>
            <h1 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-none uppercase text-content">
              {isLoggedIn ? (
                <>
                  Hello{" "}
                  <span className="italic font-light text-content/30">
                    {name}
                  </span>
                  <br />
                  Elevate Your Life.
                </>
              ) : (
                <>
                  Elevate{" "}
                  <span className="italic font-light text-content/30">
                    Your
                  </span>
                  <br />
                  Lifestyle.
                </>
              )}
            </h1>
          </AnimationItem>

          <AnimationItem>
            <p className="text-base md:text-lg text-content/50 max-w-2xl font-medium leading-relaxed tracking-tight">
              {isLoggedIn
                ? "Continue discovering premium products, exclusive collections, and curated essentials designed for your everyday lifestyle."
                : "Discover premium products, curated collections, and everyday essentials tailored to modern living."}
            </p>
          </AnimationItem>

          <AnimationItem className="flex flex-col sm:flex-row gap-4 pt-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                href={APP_ROUTES.PRODUCTS}
                variant="primary"
                size="lg"
                className="rounded-xl px-8 text-sm font-bold shadow-xl shadow-primary/20"
              >
                {isLoggedIn ? "Continue Shopping" : "Start Shopping"}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                href={isLoggedIn ? APP_ROUTES.ORDERS : APP_ROUTES.PRODUCTS}
                variant="ghost"
                size="lg"
                className="rounded-xl px-8 text-sm font-bold border border-content/[0.08] hover:bg-content/[0.02]"
              >
                {isLoggedIn ? "View Orders" : "Explore Collections"}
              </Button>
            </motion.div>
          </AnimationItem>
        </AnimationContainer>
      </AppContainer>
    </section>
  );
}
