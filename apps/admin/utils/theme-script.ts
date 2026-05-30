import { ADMIN_THEME_KEY, EAdminTheme, VALID_THEMES } from "@/config/theme";

export const adminThemeScript = `(function(){
  try {
    var raw = localStorage.getItem('${ADMIN_THEME_KEY}');
    var state = raw ? JSON.parse(raw)?.state : null;
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = state?.isDarkMode ?? systemDark;
    var theme = state?.theme || '${EAdminTheme.INDIGO}';
    var valid = ${JSON.stringify(VALID_THEMES)};
    if (!valid.includes(theme)) theme = '${EAdminTheme.INDIGO}';
    var root = document.documentElement;
    root.classList.toggle('dark', isDark);
    root.setAttribute('data-theme', theme);
    var darkBg = { indigo:'#0f1117', blue:'#020617', green:'#060c09', orange:'#0c0a09', gold:'#1c1917' };
    var lightBg = { indigo:'#f8f9fc', blue:'#f8faff', green:'#f0fdf4', orange:'#fff7ed', gold:'#fffbeb' };
    var color = isDark ? (darkBg[theme] || '#0f1117') : (lightBg[theme] || '#f8f9fc');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta); }
    meta.content = color;
  } catch(e) {}
})();`;
