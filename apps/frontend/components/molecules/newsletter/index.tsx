"use client";

import React from "react";
import Button from "@/components/atoms/button";

export const Newsletter = () => {
  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-content">Join our Newsletter</h2>
      <p className="text-sm text-content/60 leading-relaxed">
        Stay updated with the latest products, collections, and exclusive
        offers.
      </p>
      <div className="flex w-full max-w-md gap-2 mt-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="h-11 flex-1 bg-content/[0.03] border border-content/[0.05] rounded-lg px-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
        />
        <Button variant="primary" size="md" className="rounded-lg font-bold">
          Subscribe
        </Button>
      </div>
    </div>
  );
};
