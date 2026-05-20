"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

import HamburgerButton from "@/components/atoms/hamburger-button";
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
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-full bg-surface/90 backdrop-blur-xl border-r border-content/10 flex flex-col p-6 shadow-2xl overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-black tracking-wider text-primary uppercase">
                {t("menu")}
              </span>
              <HamburgerButton
                isOpen
                onClick={onClose}
                ariaLabel="Close menu"
                className="-mr-2"
              />
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
