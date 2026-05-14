import React from "react";
import { CreditCard } from "lucide-react";

export const PaymentSection = () => {
  return (
    <section>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-content text-surface flex items-center justify-center shadow-lg shadow-content/10">
          <CreditCard size={20} />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight">
          Payment Method
        </h2>
      </div>

      <div className="p-8 rounded-3xl bg-surface/50 backdrop-blur-xl border border-content/5 shadow-inner">
        <div className="flex items-center gap-6">
          <div className="w-16 h-10 bg-content/5 rounded-lg flex items-center justify-center border border-content/10">
            <div className="w-8 h-8 rounded-full bg-primary/20 animate-pulse" />
          </div>
          <div>
            <div className="font-black text-sm uppercase tracking-wider mb-1">
              Cash on Delivery
            </div>
            <div className="text-[11px] text-content/40 uppercase tracking-widest">
              Pay when you receive the items
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
