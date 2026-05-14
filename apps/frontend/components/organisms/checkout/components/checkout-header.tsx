import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { APP_ROUTES } from "@/constants/routes";

export const CheckoutHeader = () => {
  return (
    <div className="mb-12">
      <Link
        href={APP_ROUTES.CART}
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-black text-content/40 hover:text-primary transition-colors mb-6 group"
      >
        <ChevronLeft
          size={14}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to Shopping Bag
      </Link>
      <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-4 uppercase">
        CHECK<span className="italic font-light opacity-20">OUT</span>
      </h1>
      <div className="h-px w-24 bg-primary" />
    </div>
  );
};
