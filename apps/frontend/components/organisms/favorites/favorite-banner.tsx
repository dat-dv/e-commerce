"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";
import { Heart } from "lucide-react";

const FavoritesBanner = ({ count }: { count: number }) => {
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
      transition={{ duration: 1 }}
      onMouseMove={handleMouseMove}
      className="group relative mb-12 min-h-[400px] flex items-center justify-center overflow-hidden bg-transparent border-b border-content/[0.03]"
    >
      {/* Background Layer: Floating Hearts as Watermarks */}
      <div className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-content grayscale"
            initial={{
              x: ((i * 249) % 1000) - 500,
              y: ((i * 123) % 500) - 250,
              rotate: ((i * 41) % 45) - 22,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [i % 2 === 0 ? -15 : 15, i % 2 === 0 ? 15 : -15],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${10 + i * 25}%`,
              top: `${15 + (i % 3) * 25}%`,
            }}
          >
            <Heart size={180} strokeWidth={0.5} />
          </motion.div>
        ))}
      </div>

      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 transition duration-500 opacity-0 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              800px circle at ${mouseX}px ${mouseY}px,
              var(--color-primary-10, rgba(59, 130, 246, 0.03)),
              transparent 80%
            )
          `,
        }}
      />

      {/* Main Content Area */}
      <div className="relative z-20 w-full max-w-7xl px-4 flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-7xl md:text-9xl font-black tracking-[-0.05em] text-content leading-none uppercase">
              Wish
              <span className="italic font-extralight text-content/20 ml-2">
                list
              </span>
            </h1>
          </div>

          <p className="text-lg md:text-xl text-content/40 max-w-xl font-medium leading-relaxed tracking-tight">
            Your private gallery of{" "}
            <span className="text-content font-bold underline underline-offset-8 decoration-primary/20">
              curated desires
            </span>
            . Ready to be transformed into reality.
          </p>
        </div>

        <div className="flex items-center gap-10 pb-4">
          <div className="flex flex-col items-center md:items-end">
            <span className="text-5xl font-black text-content tabular-nums">
              {count.toString().padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-content/20">
              Total Items
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Grid texture */}
      <div
        className="absolute inset-0 z-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-content) 0.5px, transparent 0.5px)",
          backgroundSize: "40px 40px",
        }}
      />
    </motion.div>
  );
};

export default FavoritesBanner;
