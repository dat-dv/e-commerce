"use client";

import { Avatar } from "@ecommerce/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAdminUserStore } from "@/store/user";

interface IAdminHeaderProps {
  onMenuToggle?: () => void;
}

export const AdminHeader = ({ onMenuToggle }: IAdminHeaderProps) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAdminUserStore();
  const router = useRouter();

  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const userEmail = user?.email;
  const userAvatar = user?.avatarUrl || undefined;

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push("/sign-in");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[var(--app-bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6">
        {/* ── Left: Sidebar toggle + Brand ── */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            aria-label="Toggle sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--sidebar-text)] transition-colors hover:bg-white/8 hover:text-[var(--app-text)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Brand mark */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold tracking-tight text-[var(--app-text)]">
                Chốt Đơn
              </span>
              <span className="ml-1.5 rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-indigo-400 uppercase">
                Admin
              </span>
            </div>
          </div>
        </div>

        {/* ── Right: Actions + User menu ── */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[var(--sidebar-text)] transition-colors hover:bg-white/8 hover:text-[var(--app-text)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {/* Unread badge — remove when wiring up real notifications */}
            <span
              aria-hidden="true"
              className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-[var(--app-bg)]"
            />
          </button>

          {/* Divider */}
          <div className="mx-2 h-5 w-px bg-white/10" aria-hidden="true" />

          {/* User menu */}
          <div className="relative">
            <button
              type="button"
              id="admin-user-menu-trigger"
              aria-haspopup="true"
              aria-expanded={userMenuOpen}
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-white/8"
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 ring-2 ring-white/10">
                <Avatar name={userName} url={userAvatar} size={28} />
              </div>
              <div className="hidden text-left md:block">
                <p className="text-xs leading-tight font-semibold text-[var(--app-text)]">
                  {userName}
                </p>
                <p className="text-[11px] leading-tight text-[var(--muted)]">
                  {userEmail}
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`hidden h-3.5 w-3.5 text-[var(--muted)] transition-transform md:block ${userMenuOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown */}
            {userMenuOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  aria-hidden="true"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div
                  role="menu"
                  aria-labelledby="admin-user-menu-trigger"
                  className="absolute right-0 z-50 mt-2 w-52 origin-top-right rounded-xl border border-white/[0.06] bg-[var(--app-bg)] shadow-2xl shadow-black/30 backdrop-blur-xl"
                >
                  {/* Profile info */}
                  <div className="border-b border-white/[0.06] px-4 py-3">
                    <p className="text-xs font-semibold text-[var(--app-text)]">
                      {userName}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-[var(--muted)]">
                      {userEmail}
                    </p>
                  </div>

                  {/* Menu items */}
                  <div className="p-1">
                    {[
                      {
                        label: "Profile settings",
                        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                        id: "admin-menu-profile",
                      },
                      {
                        label: "Preferences",
                        icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
                        id: "admin-menu-preferences",
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        id={item.id}
                        role="menuitem"
                        type="button"
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-[var(--app-text)] transition-colors hover:bg-white/8"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 shrink-0 text-[var(--muted)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d={item.icon}
                          />
                        </svg>
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-white/[0.06] p-1">
                    <button
                      id="admin-menu-sign-out"
                      role="menuitem"
                      type="button"
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
                      onClick={handleLogout}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

AdminHeader.displayName = "AdminHeader";
