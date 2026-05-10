import { CONFIG_STORE_KEY, ETheme } from "@/constants/theme.constanst";

export const themeScript = `(function() {
  try {
    var raw = localStorage.getItem('${CONFIG_STORE_KEY}');
    var state = raw ? JSON.parse(raw)?.state : null;
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDarkMode = state?.isDarkMode ?? systemDark;
    var theme = state?.theme || '${ETheme.BLUE}';
    var root = document.documentElement;
    root.classList.toggle('dark', isDarkMode);
    root.setAttribute('data-theme', theme);
  } catch (e) {}
})();`;
