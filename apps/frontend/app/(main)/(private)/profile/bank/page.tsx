import React from "react";
import { Plus, CreditCard } from "lucide-react";

export default function BankAccountPage() {
  return (
    <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-content">Bank Account</h1>
          <p className="text-sm text-content/60">
            Manage your bank accounts for withdrawals.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors">
          <Plus size={18} />
          Add Bank Account
        </button>
      </div>

      <div className="border-2 border-dashed border-content/10 rounded-xl p-8 text-center flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 bg-content/5 rounded-full flex items-center justify-center text-content/40">
          <CreditCard size={24} />
        </div>
        <div>
          <p className="font-semibold text-content">
            No bank accounts added yet
          </p>
          <p className="text-sm text-content/50">
            Add a bank account to enable fast withdrawals.
          </p>
        </div>
      </div>
    </div>
  );
}
