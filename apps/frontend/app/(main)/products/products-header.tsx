"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

export function ProductsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-12 p-8 rounded-3xl backdrop-blur-md bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <ShoppingBag className="w-10 h-10 text-blue-500 fill-blue-500/10" />
        </motion.div>
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          Our Products
        </h1>
      </div>

      <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
        Explore our curated collection of premium products. We guarantee 100%
        authenticity and quality.
      </p>
    </motion.div>
  );
}

export default ProductsHeader;
