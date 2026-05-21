import { CONFIG_STORE_KEY, ETheme } from "@/constants/theme.constanst";

export const themeScript = `(function() {
  try {
    let raw = localStorage.getItem('${CONFIG_STORE_KEY}');
    let state = raw ? JSON.parse(raw)?.state : null;
    let systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let isDarkMode = state?.isDarkMode ?? systemDark;
    let theme = state?.theme || '${ETheme.BLUE}';
    if (theme !== 'blue' && theme !== 'green' && theme !== 'orange' && theme !== 'gold') {
      theme = '${ETheme.BLUE}';
    }
    let root = document.documentElement;
    root.classList.toggle('dark', isDarkMode);
    root.setAttribute('data-theme', theme);
  } catch (e) {}
})();`;
