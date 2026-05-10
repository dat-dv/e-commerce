"use client";

import { MoonIcon, SunIcon } from "@/components/atoms/icons";
import { THEMES } from "@/config/config";
import { useConfig } from "@/hooks/config/use-config";

export default function ThemeSwitcher() {
  const { theme, isDarkMode, setTheme, toggleDarkMode } = useConfig();

  return (
    <div className="flex items-center gap-4">
      {/* Theme Dots */}
      <div className="flex items-center gap-2 rounded-full border border-black/[.08] p-1 bg-surface">
        {THEMES.map((t) => {
          const active = theme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              title={t.label}
              className={`h-6 w-6 rounded-full transition-all ${
                active
                  ? "ring-2 ring-primary ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              }`}
              style={{ backgroundColor: t.color }}
            />
          );
        })}
      </div>

      <button
        onClick={toggleDarkMode}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary transition-transform hover:scale-105 active:scale-95"
      >
        {isDarkMode ? <SunIcon /> : <MoonIcon />}
      </button>
    </div>
  );
}
