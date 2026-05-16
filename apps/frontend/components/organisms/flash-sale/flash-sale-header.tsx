"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";
import { Zap, Timer, Flame, Sparkles } from "lucide-react";

const FLOATING_ICONS = [Zap, Timer, Flame, Sparkles];

export function FlashSaleHeader() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      onMouseMove={handleMouseMove}
      className="group relative mb-8 min-h-[300px] flex items-center justify-center overflow-hidden border-b border-content/[0.03]"
    >
      {/* Floating Icons Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none">
        {FLOATING_ICONS.map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-primary"
            initial={{
              x: ((i * 187) % 1000) - 500,
              y: ((i * 93) % 500) - 250,
              rotate: (i * 45) % 360,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [i % 2 === 0 ? -15 : 15, i % 2 === 0 ? 15 : -15],
            }}
            transition={{
              duration: 7 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${10 + i * 25}%`,
              top: `${15 + (i % 3) * 25}%`,
            }}
          >
            <Icon size={120} strokeWidth={1} />
          </motion.div>
        ))}
      </div>

      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 transition duration-500 opacity-0 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              var(--color-primary-10, rgba(239, 68, 68, 0.05)),
              transparent 80%
            )
          `,
        }}
      />

      {/* Main Content */}
      <div className="relative z-20 w-full max-w-6xl px-6">
        <div className="flex flex-col items-center text-center gap-6 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20"
          >
            <Flame size={14} className="text-red-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
              Limited Time Deals
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black tracking-[-0.05em] text-content leading-none uppercase">
            Flash{" "}
            <span className="italic font-light text-red-500/80">Sale</span>
          </h1>

          <p className="text-base md:text-lg text-content/50 max-w-lg font-medium leading-relaxed tracking-tight">
            High-performance technology at{" "}
            <span className="text-content font-bold underline underline-offset-4 decoration-red-500/20">
              unprecedented prices
            </span>
            . Synchronize your watches.
          </p>
        </div>
      </div>

      {/* Grid Texture */}
      <div
        className="absolute inset-0 z-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-content) 0.5px, transparent 0.5px)",
          backgroundSize: "32px 32px",
        }}
      />
    </motion.div>
  );
}
