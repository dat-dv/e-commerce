"use client";

import "react-toastify/dist/ReactToastify.css";

import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import { ToastContainer } from "react-toastify";

import { cn } from "@/utils/cn";

const AppToast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2500}
      hideProgressBar
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      limit={5}
      toastClassName={(context) => {
        const base = `relative flex min-h-[56px] w-auto min-w-[320px] items-center justify-between 
    overflow-hidden rounded-2xl px-4 py-0 mb-4 transition-all duration-300 cursor-pointer
    hover:scale-[1.03] hover:-translate-y-1 active:scale-95
    font-semibold text-[14px] tracking-tight border shadow-2xl backdrop-blur-xl`;

        const variants: Record<string, string> = {
          success:
            "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 shadow-emerald-500/10",
          error:
            "bg-rose-500/10 border-rose-500/20 text-rose-600 shadow-rose-500/10",
          warning:
            "bg-amber-500/10 border-amber-500/20 text-amber-600 shadow-amber-500/10",
          info: "bg-sky-500/10 border-sky-500/20 text-sky-600 shadow-sky-500/10",
          default: "bg-zinc-900/90 border-white/10 text-white shadow-black/20",
        };

        const type = context?.type || "default";
        return cn(base, variants[type] || variants.default);
      }}
      icon={({ type }) => {
        const iconClass =
          "w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110";
        if (type === "error")
          return <AlertOctagon className={cn(iconClass, "text-rose-500")} />;
        if (type === "success")
          return <CheckCircle2 className={cn(iconClass, "text-emerald-500")} />;
        if (type === "warning")
          return <AlertTriangle className={cn(iconClass, "text-amber-500")} />;
        return <Info className={cn(iconClass, "text-sky-500")} />;
      }}
      closeButton={({ closeToast }) => (
        <button
          onClick={closeToast}
          className="ml-2 rounded-full p-1 opacity-40 hover:bg-black/5 dark:hover:bg-white/5 hover:opacity-100 transition-all active:scale-90"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    />
  );
};

export default AppToast;
