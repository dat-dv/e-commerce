"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

type TDropdownProps = {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
};

export const Dropdown = ({
  trigger,
  children,
  align = "right",
}: TDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current) return;

      if (!ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative inline-block ${open ? "z-[9999]" : ""}`}>
      {/* Trigger */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="cursor-pointer"
        role="button"
        tabIndex={0}
      >
        {trigger}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            className={[
              "absolute mt-3 w-72 z-[100]",
              "bg-surface/95 backdrop-blur-3xl",
              "rounded-2xl border border-content/[0.08]",
              "shadow-[0_20px_70px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_70px_-10px_rgba(0,0,0,0.4)] p-2",
              align === "right" ? "right-0" : "left-0",
            ].join(" ")}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
