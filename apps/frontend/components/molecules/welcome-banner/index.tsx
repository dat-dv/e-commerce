"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface HomeWelcomeSectionProps {
  name?: string;
}

/**
 * HomeWelcomeSection serves as the premium greeting banner on the private homepage.
 * It establishes a welcoming ambient atmosphere utilizing modern typography and floating animations,
 * helping users transition smoothly into their shopping journey.
 */
export default function HomeWelcomeSection({
  name = "Dat",
}: HomeWelcomeSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-content/[0.03]">
      {/* Ambient Glow */}
      <div className="absolute top-0 right-0 h-[280px] w-[280px] rounded-full bg-primary/10 blur-[120px]" />

      {/* Watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="text-[70px] md:text-[120px] font-black tracking-[-0.08em] text-content/[0.02] uppercase select-none">
          Welcome
        </span>
      </div>

      {/* Floating Icon */}
      <motion.div
        className="pointer-events-none absolute right-[10%] top-[20%] text-content/[0.04]"
        animate={{
          y: [-8, 8, -8],
          rotate: [-8, 8, -8],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Sparkles size={100} strokeWidth={1} />
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-[320px] w-full max-w-7xl items-center px-6 py-14">
        <div className="max-w-3xl">
          <h1 className="mt-4 text-5xl md:text-7xl font-black tracking-[-0.05em] leading-none text-content uppercase">
            Hello{" "}
            <span className="italic font-light text-content/30">{name}</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base md:text-lg font-medium leading-relaxed tracking-tight text-content/50">
            Continue discovering premium products, exclusive collections, and
            curated experiences designed for your everyday lifestyle.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-3 text-sm font-bold text-white transition-all hover:scale-[1.02]"
            >
              Continue Shopping
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/orders"
              className="inline-flex items-center justify-center rounded-2xl border border-content/[0.08] px-7 py-3 text-sm font-bold text-content/70 transition-all hover:bg-content/[0.03] hover:text-content"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
