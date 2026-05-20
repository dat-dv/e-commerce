"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import Button from "@/components/atoms/button";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useLogout } from "@/hooks/auth/use-logout";

import MobileNavLinks from "./mobile-nav-links";
import UserProfileSection from "./user-profile-section";
import UserShortcuts from "./user-shortcuts";

interface IMobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavDrawer({
  isOpen,
  onClose,
}: IMobileNavDrawerProps) {
  const user = useAuthStore((store) => store.user);
  const { handleClickLogout } = useLogout();
  const t = useTranslations("Common.header");

  const handleLogout = async () => {
    onClose();
    await handleClickLogout();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-full bg-surface/90 backdrop-blur-xl border-r border-content/10 flex flex-col p-6 shadow-2xl overflow-y-auto md:hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-black tracking-wider text-primary uppercase">
                {t("menu")}
              </span>
              <Button
                variant="ghost"
                onClick={onClose}
                className="p-2 -mr-2 text-content/60 hover:text-content hover:bg-content/5 rounded-full transition-colors h-auto w-auto"
                aria-label="Close menu"
              >
                <X size={20} />
              </Button>
            </div>

            <UserProfileSection user={user} onClose={onClose} />

            <MobileNavLinks onClose={onClose} />

            {user && (
              <UserShortcuts onClose={onClose} handleLogout={handleLogout} />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
