"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";

const FLOATING_LOGOS = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1024px-Apple_logo_black.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/1024px-Samsung_Logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Asus_Logo.svg/1024px-Asus_Logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Dyson_logo.svg/1024px-Dyson_logo.svg.png",
];

export function TopBrandsHeader() {
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
      transition={{ duration: 1.5 }}
      onMouseMove={handleMouseMove}
      className="group relative mb-20 min-h-[400px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Layer: Floating Logos as Watermarks */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none">
        {FLOATING_LOGOS.map((logo, i) => (
          <motion.img
            key={i}
            src={logo}
            alt="brand watermark"
            className="absolute w-64 grayscale"
            initial={{
              x: ((i * 149) % 1000) - 500,
              y: ((i * 73) % 500) - 250,
              rotate: ((i * 31) % 45) - 22,
            }}
            animate={{
              y: [0, -40, 0],
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
          />
        ))}
      </div>

      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 transition duration-500 opacity-0 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              1000px circle at ${mouseX}px ${mouseY}px,
              var(--color-primary-10, rgba(59, 130, 246, 0.05)),
              transparent 80%
            )
          `,
        }}
      />

      {/* Main Content Area */}
      <div className="relative z-20 w-full max-w-6xl px-6">
        <div className="relative p-16 md:p-24 overflow-hidden">
          <div className="flex flex-col items-center text-center gap-10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="h-[1px] w-8 bg-primary/30" />
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary">
                  Defined Quality
                </span>
                <div className="h-[1px] w-8 bg-primary/30" />
              </div>
              <h1 className="text-7xl md:text-9xl font-black tracking-[-0.06em] text-content leading-none uppercase">
                Top{" "}
                <span className="italic font-light text-content/30">
                  Brands
                </span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-content/60 max-w-2xl font-light leading-relaxed tracking-tight">
              Explore the world&apos;s most{" "}
              <span className="text-content font-bold underline underline-offset-8 decoration-primary/20">
                iconic technology
              </span>{" "}
              and design leaders. We guarantee authenticity and
              direct-from-factory quality.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Grid texture */}
      <div
        className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-content) 0.5px, transparent 0.5px)",
          backgroundSize: "30px 30px",
        }}
      />
    </motion.div>
  );
}

export default TopBrandsHeader;
