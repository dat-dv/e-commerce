"use client";

import React from "react";
import { AnimationContainer, AnimationItem } from "@/components/atoms/animate";
import AppContainer from "@/components/atoms/app-container";
import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import { Zap } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-content/[0.02] border-b border-content/[0.05]">
      <AppContainer className="relative py-16 md:py-24">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -z-10" />

        <AnimationContainer className="max-w-2xl text-left">
          <AnimationItem>
            <span className="text-xs font-bold text-primary tracking-widest uppercase mb-3 block">
              Summer 2026
            </span>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              Upgrade Your Desk. <br />
              <span className="text-primary">Simplify Your Life.</span>
            </h1>
            <p className="text-lg opacity-70 leading-relaxed font-medium mb-8 max-w-lg">
              We find and curate the best tech and workspace gear. Simple,
              functional, and built to last.
            </p>
          </AnimationItem>

          <AnimationItem className="flex flex-col sm:flex-row gap-4">
            <Button
              href={APP_ROUTES.SIGN_IN}
              variant="primary"
              size="lg"
              className="rounded-xl px-8 text-sm font-bold shadow-lg shadow-primary/25"
            >
              Start Shopping
            </Button>
            <Button
              href="/products"
              variant="ghost"
              size="lg"
              className="rounded-xl px-8 text-sm font-bold border border-content/10"
            >
              Explore Collections
            </Button>
          </AnimationItem>
        </AnimationContainer>

        <div className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col gap-4 max-w-sm">
          <div className="bg-surface/80 backdrop-blur-xl border border-content/[0.05] p-6 rounded-2xl shadow-xl shadow-black/[0.02]">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-content mb-1">Next-Day Delivery</h3>
            <p className="text-xs text-content/60">
              Order today, get it tomorrow. Available in all major cities.
            </p>
          </div>
        </div>
      </AppContainer>
    </section>
  );
};
