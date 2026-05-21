"use client";

import { TYPOGRAPHY } from "@/constants/typography";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

interface BrandHeroProps {
  brand: TBrand;
}

export function BrandHero({ brand }: BrandHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.1]);
  const [imgError, setImgError] = useState(false);

  return (
    <section
      ref={containerRef}
      className="bg-background relative flex h-[72svh] min-h-[520px] w-full items-center justify-center overflow-hidden md:h-[80vh]"
    >
      {/* Background Banner with Parallax */}
      <motion.div style={{ y: y1, scale }} className="absolute inset-0 z-0">
        {brand.bannerUrl ? (
          <Image
            src={brand.bannerUrl}
            alt={brand.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="from-primary/20 h-full w-full bg-gradient-to-br to-purple-500/20" />
        )}
        <div className="from-background/20 via-background/40 to-background absolute inset-0 bg-gradient-to-b" />
      </motion.div>

      {/* Floating Logo and Name */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-8 px-4 md:gap-12"
      >
        {brand.logoUrl && !imgError && (
          <div className="border-content/10 bg-background/30 relative flex size-32 items-center justify-center rounded-[2rem] border p-6 shadow-2xl backdrop-blur-3xl sm:size-40 md:size-56 md:rounded-[4rem] md:p-8">
            <Image
              src={brand.logoUrl}
              alt={brand.name}
              fill
              className="object-contain drop-shadow-2xl"
              onError={() => setImgError(true)}
            />
          </div>
        )}

        <div className="max-w-full min-w-0 text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-content text-5xl leading-none font-black tracking-normal break-words uppercase sm:text-7xl md:text-[10rem]"
          >
            {brand.name}
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1, duration: 1 }}
            className="bg-primary mt-4 h-1 w-full"
          />
        </div>
      </motion.div>

      {/* Aesthetic Coordinates */}
      <div
        className={`absolute bottom-12 left-12 font-mono ${TYPOGRAPHY.badge} text-content/40 vertical-text hidden tracking-[0.4em] uppercase md:block`}
      >
        Ref // {brand.slug.toUpperCase()} -- 2024
      </div>

      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
        }
      `}</style>
    </section>
  );
}
