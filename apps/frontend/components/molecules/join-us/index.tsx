"use client";

import React from "react";
import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";

export const JoinUs = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 border-y border-content/[0.04]">
      <div className="relative z-10 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-black tracking-[-0.06em] leading-none text-content uppercase">
            Better deals,
            <br />
            picked for you.
          </h2>

          <p className="mt-6 max-w-xl text-base md:text-lg font-medium leading-relaxed text-content/50">
            Join to save your favorites, track orders, and discover selected
            offers across everyday essentials.
          </p>
        </div>

        <div className="flex md:justify-end">
          <Button
            href={APP_ROUTES.SIGN_UP}
            variant="primary"
            size="lg"
            className="rounded-xl px-8 text-sm font-bold shadow-xl shadow-primary/20"
          >
            Join Now
          </Button>
        </div>
      </div>

      <span className="pointer-events-none absolute -right-8 bottom-0 select-none text-[96px] md:text-[160px] font-black tracking-[-0.08em] uppercase leading-none text-content/[0.025]">
        Deals
      </span>
    </section>
  );
};
