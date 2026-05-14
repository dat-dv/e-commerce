"use client";

import React from "react";
import { AnimationContainer, AnimationItem } from "@/components/atoms/animate";
import AppContainer from "@/components/atoms/app-container";
import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-surface min-h-[500px] flex items-center border-b border-content/[0.03]">
      {/* 1. Ambient Light */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10 -translate-x-1/4 translate-y-1/4" />

      {/* 2. Floating Watermark & Textures */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[80px] md:text-[140px] font-black text-content opacity-[0.02] select-none pointer-events-none tracking-tighter w-full text-center">
        DISCOVER
      </div>
      <div
        className="absolute inset-0 z-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-content) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <AppContainer className="relative z-10 py-16 md:py-24 w-full">
        <AnimationContainer className="max-w-3xl text-left flex flex-col items-start gap-5">
          <AnimationItem>
            <div className="flex items-center gap-4 mb-2">
              <div className="h-[1px] w-8 bg-primary/30" />
              <span className="text-[10px] font-bold text-primary tracking-[0.5em] uppercase">
                New Arrivals
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1] uppercase text-content">
              Elevate{" "}
              <span className="italic font-light text-content/30">Your</span>{" "}
              <br />
              Workspace.
            </h1>
          </AnimationItem>

          <AnimationItem>
            <p className="text-lg md:text-xl text-content/40 leading-relaxed font-light max-w-xl">
              Find exactly what you need with our curated collection of tech and
              workspace essentials, designed to simplify your everyday life.
            </p>
          </AnimationItem>

          <AnimationItem className="flex flex-col sm:flex-row gap-5 pt-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                href={APP_ROUTES.SIGN_IN}
                variant="primary"
                size="lg"
                className="rounded-xl px-10 text-sm font-bold shadow-2xl shadow-primary/20"
              >
                Start Shopping
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                href={APP_ROUTES.PRODUCTS}
                variant="ghost"
                size="lg"
                className="rounded-xl px-10 text-sm font-bold border border-content/[0.08] hover:bg-content/[0.02]"
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
