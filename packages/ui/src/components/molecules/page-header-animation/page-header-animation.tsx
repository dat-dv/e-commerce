"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { type MouseEvent } from "react";

import { TYPOGRAPHY } from "../../../tokens";
import { LiquidWaveText } from "../../atoms/liquid-wave-text";
import { IAnimatedPageHeaderProps } from "./page-header-animation.types";

export function AnimatedPageHeader({
  title,
  highlight,
  description,
  icons,
  rightContent,
  center = false,
  entranceDuration = 0.6,
  speed = 2,
}: IAnimatedPageHeaderProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="group border-content/[0.03] relative mb-6 flex min-h-[220px] items-center justify-center overflow-hidden border-b sm:mb-8 sm:min-h-[260px]"
    >
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.06]">
        {icons.map((Icon, i) => (
          <motion.div
            key={i}
            className="text-content absolute"
            initial={{
              y: 0,
              rotate: i % 2 === 0 ? -10 : 10,
            }}
            animate={{
              y: [0, -14, 0],
              rotate: i % 2 === 0 ? [-10, 10, -10] : [10, -10, 10],
            }}
            transition={{
              duration: (14 + i * 2) / speed,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
            style={{
              left: `${15 + i * 25}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
          >
            <Icon className="size-16 sm:size-[90px]" strokeWidth={1} />
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

      <div className="relative z-20 w-full">
        <div
          className={
            center
              ? "flex flex-col items-center gap-5 py-8 text-center sm:gap-6 sm:py-10"
              : "flex flex-col items-center justify-between gap-5 py-8 text-center sm:gap-6 sm:py-10 md:flex-row md:items-end md:text-left"
          }
        >
          <div
            className={
              center
                ? "flex min-w-0 flex-col items-center gap-4 sm:gap-5"
                : "flex min-w-0 flex-col items-center gap-4 sm:gap-5 md:items-start"
            }
          >
            <h1
              className={`max-w-full break-words ${TYPOGRAPHY.heroTitle} text-content leading-none tracking-normal uppercase`}
            >
              <LiquidWaveText>
                {title}{" "}
                {highlight && (
                  <span className="font-light italic opacity-30">
                    {highlight}
                  </span>
                )}
              </LiquidWaveText>
            </h1>

            {description && (
              <LiquidWaveText
                className={
                  center
                    ? `max-w-2xl text-center ${TYPOGRAPHY.body} text-content/50 leading-relaxed font-medium tracking-normal md:text-lg`
                    : `max-w-2xl ${TYPOGRAPHY.body} text-content/50 leading-relaxed font-medium tracking-normal md:text-lg`
                }
              >
                {description}
              </LiquidWaveText>
            )}
          </div>
          {rightContent && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: entranceDuration,
                ease: "easeOut",
                delay: 0.1,
              }}
              className="shrink-0 pb-1"
            >
              {rightContent}
            </motion.div>
          )}{" "}
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
    </div>
  );
}

AnimatedPageHeader.displayName = "AnimatedPageHeader";

export default AnimatedPageHeader;
