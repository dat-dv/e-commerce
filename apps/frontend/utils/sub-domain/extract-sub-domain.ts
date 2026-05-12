const SUPPORTED_LANGUAGES = ["en", "vi"];
const DEFAULT_LANG = SUPPORTED_LANGUAGES[0];

export function getLanguageSubdomain(hostname?: string): string {
  try {
    const host =
      hostname ??
      (typeof window !== "undefined" ? window.location.hostname : null);
    if (!host) return DEFAULT_LANG;

    const subdomain = host.split(".")[0];
    if (SUPPORTED_LANGUAGES.includes(subdomain)) return subdomain;
  } catch {
    // ignore
  }

  return DEFAULT_LANG;
}
