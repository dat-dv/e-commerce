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
      <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden px-4">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-md w-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-2xl rounded-3xl p-8 shadow-2xl shadow-black/80 flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 100 }}
              className="w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-red-500/20 to-amber-500/20 border border-red-500/30 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.15)] mb-6"
            >
              <ShieldAlert className="w-10 h-10 animate-pulse" />
            </motion.div>

            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              Khu Vực Hạn Chế
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Bạn không có quyền truy cập vào trang này. Khu vực này chỉ dành
              cho Quản trị viên (Admin) của hệ thống.
            </p>

            <div className="w-full bg-white/[0.05] border border-white/[0.05] rounded-xl p-4 flex flex-col items-center mb-8">
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
                Tự động quay về trang chủ sau
              </span>
              <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden mt-3">
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
              className="w-full group py-3.5 px-5 rounded-2xl bg-white text-black font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-white/5 h-auto opacity-100 hover:opacity-100"
            >
              Quay lại Trang Chủ
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return <>{children}</>;
};
