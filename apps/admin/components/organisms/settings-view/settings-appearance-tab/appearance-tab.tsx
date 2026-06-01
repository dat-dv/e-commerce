"use client";

import { ETheme as EAdminTheme } from "@ecommerce/ui/tokens";
import { Check, Moon, Sun } from "lucide-react";

interface IAppearanceTabProps {
  theme: EAdminTheme;
  isDarkMode: boolean;
  themeChanging: EAdminTheme | null;
  modeChanging: "light" | "dark" | null;
  isChanging: boolean;
  onThemeChange: (theme: EAdminTheme) => void;
  onModeChange: (dark: boolean) => void;
}

export const AppearanceTab = ({
  theme,
  isDarkMode,
  themeChanging,
  modeChanging,
  isChanging,
  onThemeChange,
  onModeChange,
}: IAppearanceTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[var(--app-text)]">
          Appearance Settings
        </h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Customize the interface theme and accents for the admin dashboard.
        </p>
      </div>

      {/* Theme Mode Option */}
      <div className="space-y-3">
        <span className="text-xs font-bold tracking-wider text-[var(--muted)] uppercase">
          Theme Mode
        </span>
        <div className="grid grid-cols-2 gap-4">
          {/* Light theme option card */}
          <button
            type="button"
            disabled={isChanging}
            onClick={() => onModeChange(false)}
            className={`relative flex cursor-pointer flex-col gap-3 rounded-xl border p-4 text-left transition-all hover:border-[var(--muted)] ${
              !isDarkMode
                ? "border-primary bg-primary/5 ring-primary ring-1"
                : "border-[var(--border-color)] bg-white/2"
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--app-text)]">
                {modeChanging === "light" ? (
                  <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                ) : (
                  <Sun className="h-4 w-4 text-amber-500" />
                )}
                Light Theme
              </div>
              {!isDarkMode && modeChanging !== "light" && (
                <div className="bg-primary flex h-5 w-5 items-center justify-center rounded-full">
                  <Check className="h-3 w-3 font-bold text-white" />
                </div>
              )}
            </div>
            <div className="flex h-20 w-full flex-col gap-1.5 rounded border border-black/5 bg-white/90 p-2 shadow-sm">
              <div className="bg-primary h-2.5 w-1/3 rounded" />
              <div className="h-2 w-full rounded bg-slate-200" />
              <div className="h-2 w-5/6 rounded bg-slate-200" />
            </div>
          </button>

          {/* Dark theme option card */}
          <button
            type="button"
            disabled={isChanging}
            onClick={() => onModeChange(true)}
            className={`relative flex cursor-pointer flex-col gap-3 rounded-xl border p-4 text-left transition-all hover:border-[var(--muted)] ${
              isDarkMode
                ? "border-primary bg-primary/5 ring-primary ring-1"
                : "border-[var(--border-color)] bg-white/2"
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--app-text)]">
                {modeChanging === "dark" ? (
                  <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                ) : (
                  <Moon className="text-primary h-4 w-4" />
                )}
                Dark Theme
              </div>
              {isDarkMode && modeChanging !== "dark" && (
                <div className="bg-primary flex h-5 w-5 items-center justify-center rounded-full">
                  <Check className="h-3 w-3 font-bold text-white" />
                </div>
              )}
            </div>
            <div className="flex h-20 w-full flex-col gap-1.5 rounded border border-white/5 bg-slate-900 p-2 shadow-sm">
              <div className="bg-primary h-2.5 w-1/3 rounded" />
              <div className="h-2 w-full rounded bg-slate-700" />
              <div className="h-2 w-5/6 rounded bg-slate-700" />
            </div>
          </button>
        </div>
      </div>

      {/* Accent Color Theme Option */}
      <div className="space-y-3">
        <span className="text-xs font-bold tracking-wider text-[var(--muted)] uppercase">
          Accent Color
        </span>
        <p className="text-xs text-[var(--muted)]">
          Applies color variations across active buttons, notifications,
          highlight borders, and badges.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          {[
            {
              name: EAdminTheme.BLUE,
              label: "Blue Accent",
              colorClass: "bg-blue-500",
            },
            {
              name: EAdminTheme.GREEN,
              label: "Green Accent",
              colorClass: "bg-emerald-500",
            },
            {
              name: EAdminTheme.ORANGE,
              label: "Orange Accent",
              colorClass: "bg-orange-500",
            },
            {
              name: EAdminTheme.GOLD,
              label: "Gold Accent",
              colorClass: "bg-amber-500",
            },
          ].map((item) => (
            <button
              key={item.name}
              type="button"
              disabled={isChanging}
              onClick={() => onThemeChange(item.name)}
              className={`relative flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all hover:border-[var(--muted)] ${
                theme === item.name
                  ? "border-primary bg-primary/5"
                  : "border-[var(--border-color)] bg-white/2"
              }`}
            >
              {themeChanging === item.name ? (
                <div className="flex h-5 w-5 items-center justify-center">
                  <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                </div>
              ) : (
                <span
                  className={`h-5 w-5 rounded-full ${item.colorClass} shadow-sm`}
                />
              )}
              <span className="text-sm font-medium text-[var(--app-text)]">
                {item.label}
              </span>
              {theme === item.name && themeChanging !== item.name && (
                <div className="bg-primary ml-2 flex h-4 w-4 items-center justify-center rounded-full">
                  <Check className="h-2.5 w-2.5 font-bold text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

AppearanceTab.displayName = "AppearanceTab";
