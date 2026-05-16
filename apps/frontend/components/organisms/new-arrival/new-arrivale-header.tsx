"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";
import { PackagePlus, Sparkles, Clock, ShoppingBag } from "lucide-react";

const FLOATING_ICONS = [PackagePlus, Sparkles, Clock, ShoppingBag];

export function FreshArrivalsHeader() {
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
      className="group relative mb-8 min-h-[260px] flex items-center justify-center overflow-hidden border-b border-content/[0.03]"
    >
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

      <motion.div
        className="pointer-events-none absolute inset-0 z-10 transition duration-500 opacity-0 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              700px circle at ${mouseX}px ${mouseY}px,
              var(--color-primary-10, rgba(59, 130, 246, 0.04)),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-20 w-full max-w-6xl px-6">
        <div className="flex flex-col items-center text-center gap-5 py-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-[-0.05em] text-content leading-none uppercase">
            Fresh{" "}
            <span className="italic font-light text-content/30">Arrivals</span>
          </h1>

          <p className="text-base md:text-lg text-content/50 max-w-2xl font-medium leading-relaxed tracking-tight">
            Stay ahead of the curve with our{" "}
            <span className="text-content font-bold underline underline-offset-4 decoration-primary/20">
              latest trends
            </span>{" "}
            curated just for you.
          </p>

          <p className="text-sm md:text-base text-content/35 max-w-2xl font-medium leading-relaxed">
            Our latest collection is currently being curated and will be
            available here shortly. Check back often so you don&apos;t miss our
            newest releases.
          </p>
        </div>
      </div>

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

export default FreshArrivalsHeader;
