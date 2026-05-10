'use client';

import { useCallback } from 'react';

import { ETheme } from '@/constants/theme.constanst';

import { useAppConfig } from '../use-config-store';

export const useConfig = () => {
  const theme = useAppConfig((s) => s.theme);
  const isDarkMode = useAppConfig((s) => s.isDarkMode);

  const setThemeStore = useAppConfig((s) => s.setTheme);
  const setDarkModeStore = useAppConfig((s) => s.setDarkMode);
  const toggleDarkModeStore = useAppConfig((s) => s.toggleDarkMode);

  const setTheme = useCallback(
    (newTheme: ETheme) => {
      setThemeStore(newTheme);
      document?.documentElement?.setAttribute('data-theme', newTheme);
    },
    [setThemeStore],
  );

  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !isDarkMode;
    toggleDarkModeStore();
    document?.documentElement?.classList.toggle('dark', newDarkMode);
  }, [isDarkMode, toggleDarkModeStore]);

  const setDarkMode = useCallback(
    (isDarkMode: boolean) => {
      setDarkModeStore(isDarkMode);
      document?.documentElement?.classList.toggle('dark', isDarkMode);
    },
    [setDarkModeStore],
  );

  return {
    theme,
    isDarkMode,
    setTheme,
    toggleDarkMode,
    setDarkMode,
  };
};
