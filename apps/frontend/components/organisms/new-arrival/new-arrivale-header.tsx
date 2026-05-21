"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";
import { PackagePlus, Sparkles, Clock, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";

const FLOATING_ICONS = [PackagePlus, Sparkles, Clock, ShoppingBag];

export function FreshArrivalsHeader() {
  const t = useTranslations("NewArrivalsPage.header");
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
      className="group border-content/[0.03] relative mb-6 flex min-h-[220px] items-center justify-center overflow-hidden border-b sm:mb-8 sm:min-h-[260px]"
    >
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.06]">
        {FLOATING_ICONS.map((Icon, i) => (
          <motion.div
            key={i}
            className="text-content absolute"
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
            <Icon size={90} strokeWidth={1} aria-hidden="true" />
          </motion.div>
        ))}
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition duration-500 group-hover:opacity-100"
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

      <div className="relative z-20 w-full max-w-6xl px-4 sm:px-6">
        <div className="flex min-w-0 flex-col items-center gap-4 py-8 text-center sm:gap-5 sm:py-10">
          <h1 className="text-content max-w-full text-4xl leading-none font-black uppercase sm:text-5xl md:text-7xl">
            {t("title")}{" "}
            <span className="text-content/30 font-light italic">
              {t("highlight")}
            </span>
          </h1>

          <p className="text-content/50 max-w-2xl text-sm leading-relaxed font-medium sm:text-base md:text-lg">
            {t.rich("description", {
              strong: (chunks) => (
                <span className="text-content decoration-primary/20 font-bold underline underline-offset-4">
                  {chunks}
                </span>
              ),
            })}
          </p>

          <p className="text-content/35 max-w-2xl text-sm leading-relaxed font-medium md:text-base">
            {t("note")}
          </p>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.015]"
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
