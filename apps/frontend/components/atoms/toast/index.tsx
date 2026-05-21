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
import { UI_RADIUS } from "@/constants/ui-radius";

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
      theme="colored"
      limit={5}
      toastClassName={(context) => {
        const base = cn(
          UI_RADIUS.modal,
          `relative flex min-h-[56px] w-auto min-w-[320px]
items-center justify-between overflow-hidden
px-4 py-0 mb-4 transition-all duration-300 cursor-pointer
hover:-translate-y-0.5 active:scale-[0.98]
font-semibold text-[14px] tracking-tight border shadow-md`,
        );

        const variants: Record<string, string> = {
          success:
            "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-emerald-500/10 dark:bg-emerald-950/80 dark:border-emerald-500/20 dark:text-emerald-300",
          error:
            "bg-rose-50 border-rose-200 text-rose-700 shadow-rose-500/10 dark:bg-rose-950/80 dark:border-rose-500/20 dark:text-rose-300",
          warning:
            "bg-amber-50 border-amber-200 text-amber-700 shadow-amber-500/10 dark:bg-amber-950/80 dark:border-amber-500/20 dark:text-amber-300",
          info: "bg-sky-50 border-sky-200 text-sky-700 shadow-sky-500/10 dark:bg-sky-950/80 dark:border-sky-500/20 dark:text-sky-300",
          default:
            "bg-zinc-900 border-zinc-800 text-white shadow-black/20 dark:bg-zinc-100 dark:border-zinc-200 dark:text-zinc-900",
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
          className="ml-2 rounded-full p-1 opacity-40 hover:bg-black/5 dark:hover:bg-white/10 hover:opacity-100 transition-all active:scale-90"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    />
  );
};

export default AppToast;
