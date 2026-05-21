"use client";

import { APP_ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { EDefaultRoleName } from "@ecommerce/shared";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

import Button from "@/components/atoms/button";

export interface AdminGuardProps {
  children: ReactNode;
}

export const AdminGuard = ({ children }: AdminGuardProps) => {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const isAdmin = user?.roleName === EDefaultRoleName.ADMIN;

  if (!isAdmin) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 px-4">
        <div className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-amber-500/10 blur-[120px]" />

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex w-full max-w-md flex-col items-center rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 text-center shadow-2xl shadow-black/80 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 100 }}
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-red-500/30 bg-gradient-to-tr from-red-500/20 to-amber-500/20 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.15)]"
            >
              <ShieldAlert className="h-10 w-10 animate-pulse" />
            </motion.div>

            <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">
              Khu Vực Hạn Chế
            </h1>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              Bạn không có quyền truy cập vào trang này. Khu vực này chỉ dành
              cho Quản trị viên (Admin) của hệ thống.
            </p>

            <div className="mb-8 flex w-full flex-col items-center rounded-xl border border-white/[0.05] bg-white/[0.05] p-4">
              <span className="mb-2 text-xs font-medium tracking-wider text-slate-500 uppercase">
                Tự động quay về trang chủ sau
              </span>
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/[0.05]">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="h-full bg-gradient-to-r from-red-500 to-amber-500"
                />
              </div>
            </div>

            <Button
              onClick={() => router.push(APP_ROUTES.HOME)}
              className="group flex h-auto w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-black opacity-100 shadow-lg shadow-white/5 transition-all duration-200 hover:bg-slate-100 hover:opacity-100 active:scale-[0.98]"
            >
              Quay lại Trang Chủ
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return <>{children}</>;
};
