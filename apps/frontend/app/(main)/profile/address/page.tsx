import React from "react";
import { Plus, MapPin } from "lucide-react";

export default function AddressesPage() {
  return (
    <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-content">My Addresses</h1>
          <p className="text-sm text-content/60">Manage your shipping addresses.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors">
          <Plus size={18} />
          Add New Address
        </button>
      </div>

      <div className="border-2 border-dashed border-content/10 rounded-xl p-8 text-center flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 bg-content/5 rounded-full flex items-center justify-center text-content/40">
          <MapPin size={24} />
        </div>
        <div>
          <p className="font-semibold text-content">No addresses added yet</p>
          <p className="text-sm text-content/50">Add a shipping address to use during checkout.</p>
        </div>
      </div>
    </div>
  );
}
