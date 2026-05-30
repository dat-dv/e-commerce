import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ISidebarStore {
  isOpen: boolean; // Mobile drawer open/close
  isCollapsed: boolean; // Desktop sidebar collapsed/expanded
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useAdminSidebarStore = create<ISidebarStore>()(
  persist(
    (set) => ({
      isOpen: false,
      isCollapsed: false,
      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (open) => set({ isOpen: open }),
      toggleCollapsed: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),
      setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
    }),
    {
      name: "admin-sidebar-storage",
      partialize: (state) => ({ isCollapsed: state.isCollapsed }), // Only persist collapsed state
    },
  ),
);
