"use client";

import React from "react";
import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";

export const PromoBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-surface via-surface to-primary/5 border border-content/[0.08] shadow-2xl shadow-primary/5">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-xl space-y-5 z-10">
        <span className="text-xs font-black text-primary tracking-[0.2em] uppercase bg-primary/10 px-3 py-1.5 rounded-full inline-block">
          Stay Updated
        </span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] text-content">
          Unlock Exclusive Deals
        </h2>
        <p className="text-content/60 text-base md:text-lg leading-relaxed font-medium">
          Stay connected to discover great products at the best prices and be
          the first to know about our special promotions.
        </p>
        <div className="pt-2">
          <Button
            href={APP_ROUTES.SIGN_UP}
            variant="primary"
            size="lg"
            className="rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
          >
            Join Now
          </Button>
        </div>
      </div>

      <div className="text-[120px] md:text-[180px] font-black text-content opacity-[0.02] select-none absolute right-0 bottom-0 translate-y-1/4 translate-x-1/4 pointer-events-none tracking-tighter">
        CONNECT
      </div>
    </div>
  );
};
