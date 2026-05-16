"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

interface NotificationFiltersProps {
  onSearch: (query: string) => void;
}

export const NotificationFilters = ({ onSearch }: NotificationFiltersProps) => {
  const [value, setValue] = useState("");

  const handleSearch = () => {
    onSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center p-1 rounded-2xl bg-surface border border-content/[0.08] hover:border-content/[0.15] transition-all duration-300 shadow-sm shadow-content/[0.02]">
      <div className="relative flex-1 group">
        <Search
          size={15}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-content/30 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search notifications..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            // Optional: Live search
            onSearch(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent border-0 focus:ring-0 outline-none text-sm pl-11 pr-28 py-3 text-content placeholder:text-content/40 font-medium"
        />
        <button
          onClick={handleSearch}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-6 py-2 bg-content/[0.06] hover:bg-content/[0.12] text-content rounded-full text-xs font-bold transition-all active:scale-95"
        >
          Search
        </button>
      </div>
    </div>
  );
};
