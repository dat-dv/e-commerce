import { ETheme as EAdminTheme } from "@ecommerce/ui/tokens";

import { ADMIN_THEME_KEY, VALID_THEMES } from "@/config/theme";

export const adminThemeScript = `(function(){
  try {
    var raw = localStorage.getItem('${ADMIN_THEME_KEY}');
    var state = raw ? JSON.parse(raw)?.state : null;
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = state?.isDarkMode ?? systemDark;
    var theme = state?.theme || '${EAdminTheme.BLUE}';
    var valid = ${JSON.stringify(VALID_THEMES)};
    if (!valid.includes(theme)) theme = '${EAdminTheme.BLUE}';
    var root = document.documentElement;
    root.classList.toggle('dark', isDark);
    root.setAttribute('data-theme', theme);
    var darkBg = { blue:'#020617', green:'#060c09', orange:'#0c0a09', gold:'#1c1917' };
    var color = isDark ? (darkBg[theme] || '#020617') : '#ffffff';
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta); }
    meta.content = color;
  } catch(e) {}
})();`;
