"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

export function ProductsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-12 p-8 rounded-3xl bg-surface border border-content/5 backdrop-blur-md shadow-xl shadow-black/[0.02]"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <ShoppingBag className="w-10 h-10 text-primary fill-primary/10" />
        </motion.div>
        <h1 className="text-4xl font-bold text-content">Our Products</h1>
      </div>

      <p className="text-lg text-content/70 max-w-2xl">
        Explore our curated collection of premium products. We guarantee 100%
        authenticity and quality.
      </p>
    </motion.div>
  );
}

export default ProductsHeader;
