"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { APP_ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

const HeaderNav = () => {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-6">
      {[
        { href: APP_ROUTES.HOME, label: "Home", exact: true },
        { href: "/products", label: "Products", exact: false },
      ].map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative text-sm font-bold transition-all hover:text-primary",
              isActive
                ? "text-primary"
                : "text-content/40 hover:text-content/60",
            )}
          >
            {link.label}
            {isActive && (
              <span className="absolute -bottom-[22px] left-0 h-[2.5px] w-full bg-primary rounded-full shadow-[0_-2px_8px_rgba(var(--primary),0.4)]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

HeaderNav.displayName = "HeaderNav";

export default HeaderNav;
