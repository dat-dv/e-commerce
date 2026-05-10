"use client";

import React from "react";
import { Sparkles, ArrowRight, ShoppingCart, Package } from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";

interface WelcomeBannerProps {
  userName: string;
  cartCount: number;
  orderCount: number;
}

export const WelcomeBanner = ({
  userName,
  cartCount,
  orderCount,
}: WelcomeBannerProps) => {
  return (
    <div className="glass bg-surface/60 backdrop-blur-xl border border-content/10 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl shadow-black/[0.02] relative overflow-hidden">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 via-purple-500/5 to-transparent -z-10" />
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl -z-10" />

      {/* Left: Greeting & Message */}
      <div className="flex flex-col md:flex-row items-center gap-6 w-full lg:w-auto">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-primary/20 flex-shrink-0">
          {userName.charAt(0).toUpperCase()}
        </div>

        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs font-bold text-primary tracking-widest uppercase flex items-center gap-1.5 justify-center md:justify-start">
            <Sparkles className="w-3.5 h-3.5" />
            Member
          </span>
          <h1 className="text-3xl font-black tracking-tight leading-tight text-content">
            Hello,{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              {userName}
            </span>
            !
          </h1>
          <p className="text-sm text-content/60 font-medium">
            {"Welcome back to your personalized shopping experience."}
          </p>
        </div>
      </div>

      {/* Right: Quick Stats & Call to Action */}
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto justify-between lg:justify-end">
        {/* Quick Stats (Clean and integrated with links) */}
        <div className="flex items-center gap-8">
          <Link href={APP_ROUTES.CART} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-content/[0.03] border border-content/[0.05] flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
              <ShoppingCart className="w-4 h-4 text-content/60 group-hover:text-primary transition-colors" />
            </div>
            <div>
              <p className="text-xs text-content/40 font-bold uppercase tracking-wider">
                In Cart
              </p>
              <p className="text-lg font-black text-content group-hover:text-primary transition-colors">
                {cartCount} Items
              </p>
            </div>
          </Link>

          <Link href={APP_ROUTES.ORDERS} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-content/[0.03] border border-content/[0.05] flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
              <Package className="w-4 h-4 text-content/60 group-hover:text-primary transition-colors" />
            </div>
            <div>
              <p className="text-xs text-content/40 font-bold uppercase tracking-wider">
                Orders
              </p>
              <p className="text-lg font-black text-content group-hover:text-primary transition-colors">
                {orderCount} Active
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
