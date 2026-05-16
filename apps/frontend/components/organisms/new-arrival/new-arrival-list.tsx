"use client";

import { motion } from "framer-motion";

const NewArrivalList = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="py-8"
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-content/30 mb-2">
            Collection
          </p>
          <h2 className="text-2xl font-black text-content tracking-tight">
            Latest Products
          </h2>
        </div>
      </div>

      {/* Skeleton product grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.04 }}
            className="flex flex-col gap-3"
          >
            <div className="aspect-[3/4] rounded-3xl bg-content/[0.03] border border-content/[0.05] overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-content/[0.02] to-transparent" />
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-[0.3em] text-primary/60 rounded-full">
                New
              </div>
            </div>
            <div className="space-y-2 px-1">
              <div
                className="h-3 bg-content/[0.05] rounded-full animate-pulse"
                style={{ width: `${60 + (i % 4) * 10}%` }}
              />
              <div className="h-3 w-1/3 bg-content/[0.04] rounded-full animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default NewArrivalList;
