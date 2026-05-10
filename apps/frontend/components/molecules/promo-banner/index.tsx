"use client";

import React from "react";
import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";

export const PromoBanner = () => {
  return (
    <div className="bg-content text-surface rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
      {/* Background pattern or glow */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-[100px] -z-10" />

      <div className="max-w-md space-y-4">
        <span className="text-xs font-bold text-primary tracking-widest uppercase">
          Limited Offer
        </span>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
          Get 20% Off Your First Order
        </h2>
        <p className="text-surface/70 text-sm leading-relaxed">
          Sign up now and get a discount code on your first purchase. Don&apos;t
          miss out!
        </p>
        <Button
          href={APP_ROUTES.SIGN_UP}
          variant="primary"
          size="md"
          className="rounded-lg font-bold"
        >
          Sign Up Now
        </Button>
      </div>

      {/* Visual element or just clean text */}
      <div className="text-6xl md:text-8xl font-black opacity-10 select-none">
        SALE
      </div>
    </div>
  );
};
