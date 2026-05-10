"use client";

import React from "react";
import SidebarLayout from "@/components/molecules/sidebar-layout";
import {
  Bell,
  User,
  CreditCard,
  MapPin,
  Lock,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="space-y-6">
      <h1 className="text-sm font-bold tracking-wider text-content/40 uppercase mb-4 ml-1">
        Account Settings
      </h1>
      <div>
        <h3 className="font-bold text-content mb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-content/60" />
          My Account
        </h3>
        <ul className="space-y-2 ml-7">
          <li>
            <Link
              href="/profile"
              className={cn(
                "font-medium flex items-center gap-2 transition-colors",
                pathname === "/profile"
                  ? "text-primary"
                  : "text-content/60 hover:text-content",
              )}
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              href="/profile/bank"
              className={cn(
                "font-medium flex items-center gap-2 transition-colors",
                pathname === "/profile/bank"
                  ? "text-primary"
                  : "text-content/60 hover:text-content",
              )}
            >
              Bank Account
            </Link>
          </li>
          <li>
            <Link
              href="/profile/address"
              className={cn(
                "font-medium flex items-center gap-2 transition-colors",
                pathname === "/profile/address"
                  ? "text-primary"
                  : "text-content/60 hover:text-content",
              )}
            >
              Addresses
            </Link>
          </li>
          <li>
            <Link
              href="/profile/password"
              className={cn(
                "font-medium flex items-center gap-2 transition-colors",
                pathname === "/profile/password"
                  ? "text-primary"
                  : "text-content/60 hover:text-content",
              )}
            >
              Change Password
            </Link>
          </li>
        </ul>
      </div>

      {/* Notifications */}
      <div>
        <Link
          href="/notifications"
          className="font-bold text-content flex items-center gap-2 hover:text-primary transition-colors"
        >
          <Bell className="w-5 h-5 text-content/60" />
          Notifications
        </Link>
      </div>

      {/* Purchase History */}
      <div>
        <Link
          href="/orders"
          className="font-bold text-content flex items-center gap-2 hover:text-primary transition-colors"
        >
          <ShoppingBag className="w-5 h-5 text-content/60" />
          My Purchases
        </Link>
      </div>

      {/* Cart */}
      <div>
        <Link
          href="/cart"
          className="font-bold text-content flex items-center gap-2 hover:text-primary transition-colors"
        >
          <ShoppingCart className="w-5 h-5 text-content/60" />
          My Cart
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-80px)] pt-10 bg-gradient-to-b from-surface to-transparent">
      <SidebarLayout header={null} sidebar={sidebarContent}>
        {children}
      </SidebarLayout>
    </div>
  );
}
