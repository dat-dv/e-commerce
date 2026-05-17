"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import { useRef, useState } from "react";
import Image from "next/image";

interface BrandHeroProps {
  brand: TBrand;
}

/**
 * BrandHero
 *
 * Why: Renders the highly aesthetic hero banner for the brand page. It utilizes framer-motion scroll-linked
 * transformations to create a fluid, hardware-accelerated parallax movement and fade animation on scroll.
 */
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
      className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center bg-background"
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
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background" />
      </motion.div>

      {/* Floating Logo and Name */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex flex-col items-center gap-12"
      >
        {brand.logoUrl && !imgError && (
          <div className="relative w-40 h-40 md:w-56 md:h-56 p-8 rounded-[4rem] bg-background/30 backdrop-blur-3xl border border-content/10 shadow-2xl flex items-center justify-center">
            <Image
              src={brand.logoUrl}
              alt={brand.name}
              fill
              className="object-contain drop-shadow-2xl"
              onError={() => setImgError(true)}
            />
          </div>
        )}

        <div className="text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-7xl md:text-[10rem] font-black tracking-tighter text-content leading-none uppercase"
          >
            {brand.name}
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1, duration: 1 }}
            className="h-1 w-full bg-primary mt-4"
          />
        </div>
      </motion.div>

      {/* Aesthetic Coordinates */}
      <div className="absolute bottom-12 left-12 font-mono text-[10px] text-content/40 tracking-[0.4em] uppercase vertical-text hidden md:block">
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
