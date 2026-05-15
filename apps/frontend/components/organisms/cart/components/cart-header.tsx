"use client";

import { X, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

interface CartHeaderProps {
  count: number;
  onClose: () => void;
}

export const CartHeader = ({ count, onClose }: CartHeaderProps) => {
  return (
    <div className="flex items-center justify-between pl-4 pr-2 py-4 border-b border-content/[0.05] bg-surface/50 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold text-content">Shopping Cart</h2>
        <span className="text-sm font-medium text-content/30">
          ({count} items)
        </span>
      </div>
      <button
        onClick={onClose}
        className="w-8 h-8 flex items-center justify-center text-content/40 hover:text-content hover:bg-content/5 rounded-full transition-all"
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </div>
  );
};
