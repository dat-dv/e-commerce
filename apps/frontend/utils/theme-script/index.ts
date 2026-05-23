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
    
    let darkColors = {
      blue: '#020617',
      green: '#060c09',
      orange: '#0c0a09',
      gold: '#1c1917'
    };
    let color = isDarkMode ? (darkColors[theme] || '#020617') : '#ffffff';
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', color);
  } catch (e) {}
})();`;
