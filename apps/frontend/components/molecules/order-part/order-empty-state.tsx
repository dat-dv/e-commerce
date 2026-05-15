"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";

interface OrderEmptyStateProps {
  message: string;
  delay?: number;
}

export const OrderEmptyState = ({
  message,
  delay = 0.3,
}: OrderEmptyStateProps) => {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay, duration: 0.4 }}
      className="py-40 rounded-3xl bg-surface/40 backdrop-blur-xl border border-content/[0.03] flex flex-col items-center justify-center text-center shadow-2xl shadow-content/5"
    >
      <div className="w-24 h-24 rounded-full bg-content/[0.02] flex items-center justify-center mb-10 border border-content/[0.05] relative group">
        <div className="absolute inset-0 bg-primary/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
        <ShoppingBag
          size={40}
          className="text-content/10 group-hover:text-primary/40 transition-colors duration-500"
        />
      </div>
      <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter text-content">
        Collection Empty
      </h2>
      <p className="text-content/40 mb-12 max-w-xs text-xs font-medium leading-relaxed">
        {message}
      </p>
      <Link
        href={APP_ROUTES.PRODUCTS}
        className="group relative px-12 py-5 bg-content text-surface text-[10px] uppercase tracking-[0.4em] font-black rounded-full overflow-hidden transition-all hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-1"
      >
        <span className="relative z-10">Start Acquisition</span>
        <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      </Link>
    </motion.div>
  );
};
