"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";

export const EmptyCart = () => {
  return (
    <div className="bg-surface/50 border border-content/[0.05] backdrop-blur-3xl rounded-[2rem] p-24 text-center flex flex-col items-center justify-center min-h-[50vh] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 blur-xl pointer-events-none" />

      <div className="bg-content/[0.02] p-8 rounded-full mb-10 border border-content/5 relative group">
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <ShoppingBag size={64} className="text-content/10 relative z-10" />
      </div>

      <h2 className="text-3xl font-black uppercase tracking-tight mb-4">
        THE BAG IS{" "}
        <span className="italic font-light opacity-30 text-content">EMPTY</span>
      </h2>
      <p className="text-content/40 mb-12 max-w-xs italic font-light leading-relaxed">
        Curate your selection by exploring our premium collections and
        high-performance hardware.
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        <Link
          href={APP_ROUTES.HOME}
          className="bg-content text-surface hover:bg-primary hover:text-primary-foreground px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.3em] transition-all shadow-2xl shadow-content/20 active:scale-95"
        >
          Explore Now
        </Link>
      </div>
    </div>
  );
};
