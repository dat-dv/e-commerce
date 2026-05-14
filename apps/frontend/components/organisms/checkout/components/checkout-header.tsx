import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { APP_ROUTES } from "@/constants/routes";

export const CheckoutHeader = () => {
  return (
    <div className="mb-12">
      <Link
        href={APP_ROUTES.CART}
        className="inline-flex items-center gap-2 text-sm font-medium text-content/60 hover:text-primary transition-colors mb-6 group"
      >
        <ChevronLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to Shopping Bag
      </Link>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-content mb-4">
        Checkout
      </h1>
      <div className="h-px w-24 bg-primary" />
    </div>
  );
};
