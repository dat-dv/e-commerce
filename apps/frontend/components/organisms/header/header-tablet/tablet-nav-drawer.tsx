"use client";

import { AnimatePresence, motion } from "framer-motion";

import HamburgerButton from "@/components/atoms/hamburger-button";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useLogout } from "@/hooks/auth/use-logout";

import HeaderLogo from "../header-desktop/header-logo";
import MobileNavLinks from "./tablet-nav-links";
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
            className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="border-content/10 bg-surface fixed top-0 bottom-0 left-0 z-50 flex w-[86vw] max-w-[360px] flex-col border-r shadow-2xl sm:max-w-[380px] md:max-w-[420px]"
          >
            <div className="border-content/10 flex h-16 shrink-0 items-center justify-between border-b px-4">
              <HeaderLogo />
              <HamburgerButton
                isOpen
                onClick={onClose}
                ariaLabel="Close menu"
                className="-mr-2"
              />
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-5">
              <MobileNavLinks onClose={onClose} />

              {user && (
                <UserShortcuts onClose={onClose} handleLogout={handleLogout} />
              )}
              <UserProfileSection
                user={user}
                onClose={onClose}
                className="border-content/10 mt-auto border-t pt-4"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
