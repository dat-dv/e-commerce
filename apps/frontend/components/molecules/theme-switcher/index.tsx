"use client";

import Button from "@/components/atoms/button";
import { MoonIcon, SunIcon } from "@/components/atoms/icons";
import ThemeSwatch from "@/components/atoms/theme-swatch";
import { THEMES } from "@/config/config";
import { useConfig } from "@/hooks/config/use-config";

export default function ThemeSwitcher() {
  const { theme, isDarkMode, setTheme, toggleDarkMode } = useConfig();

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 rounded-full border border-black/[.08] p-1 bg-surface">
        {THEMES.map((t) => {
          const active = theme === t.id;
          return (
            <ThemeSwatch
              key={t.id}
              onClick={() => setTheme(t.id)}
              title={t.label}
              color={t.color}
              selected={active}
              className="h-6 w-6"
            />
          );
        })}
      </div>

      <Button
        type="button"
        variant="primary"
        size="icon"
        onClick={toggleDarkMode}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary transition-transform hover:scale-105 active:scale-95"
      >
        {isDarkMode ? <SunIcon /> : <MoonIcon />}
      </Button>
    </div>
  );
}
