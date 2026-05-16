"use client";
import { motion } from "framer-motion";

const FlashSaleList = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative z-20 w-full"
    >
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-12">
        <div className="w-full p-12 rounded-[2.5rem] bg-content/[0.02] border border-content/[0.05] backdrop-blur-3xl relative overflow-hidden group">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[80px] -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 flex flex-col items-center gap-8">
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl md:text-3xl font-black text-content uppercase tracking-tight">
                Synchronizing Deals
              </h2>
              <p className="text-content/40 font-medium max-w-md mx-auto">
                The next batch of high-performance offers is being prepared.
                Stay synchronized.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-[4/5] rounded-3xl bg-content/[0.03] border border-content/[0.05] animate-pulse relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-content/[0.02] to-transparent" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FlashSaleList;
