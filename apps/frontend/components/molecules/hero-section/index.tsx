"use client";

import { AnimationContainer, AnimationItem } from "@/components/atoms/animate";
import AppContainer from "@/components/atoms/app-container";
import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import { motion } from "framer-motion";
import { Sparkles, ShoppingBag, Laptop, Package } from "lucide-react";

const FLOATING_ICONS = [Sparkles, ShoppingBag, Laptop, Package];

export const HeroSection = () => {
  return (
    <section className="relative mb-8 min-h-[420px] flex items-center overflow-hidden border-b border-content/[0.03]">
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none">
        {FLOATING_ICONS.map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-content"
            initial={{
              x: ((i * 149) % 1000) - 500,
              y: ((i * 73) % 500) - 250,
              rotate: ((i * 31) % 45) - 22,
            }}
            animate={{
              y: [0, -24, 0],
              rotate: [i % 2 === 0 ? -10 : 10, i % 2 === 0 ? 10 : -10],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${15 + i * 25}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
          >
            <Icon size={90} strokeWidth={1} />
          </motion.div>
        ))}
      </div>

      <div
        className="absolute inset-0 z-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-content) 0.5px, transparent 0.5px)",
          backgroundSize: "32px 32px",
        }}
      />

      <AppContainer className="relative z-10 w-full py-16">
        <AnimationContainer className="max-w-3xl flex flex-col items-start gap-5">
          <AnimationItem>
            <h1 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-none uppercase text-content">
              Elevate{" "}
              <span className="italic font-light text-content/30">Your</span>
              <br />
              Workspace.
            </h1>
          </AnimationItem>

          <AnimationItem>
            <p className="text-base md:text-lg text-content/50 max-w-2xl font-medium leading-relaxed tracking-tight">
              Find exactly what you need with our curated collection of tech and
              workspace essentials, designed to simplify your everyday life.
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
                Start Shopping
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                href={APP_ROUTES.PRODUCTS}
                variant="ghost"
                size="lg"
                className="rounded-xl px-8 text-sm font-bold border border-content/[0.08] hover:bg-content/[0.02]"
              >
                Explore Collections
              </Button>
            </motion.div>
          </AnimationItem>
        </AnimationContainer>
      </AppContainer>
    </section>
  );
};
