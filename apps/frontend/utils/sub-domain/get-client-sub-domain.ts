const SUPPORTED_LANGUAGES = ["en", "vi"] as const;
const DEFAULT_LANG = SUPPORTED_LANGUAGES[0];

export function getSubdomainByHostname(
  hostname?: string,
): (typeof SUPPORTED_LANGUAGES)[number] {
  try {
    const host =
      hostname ??
      (typeof window !== "undefined" ? window.location.hostname : null);
    if (!host) return DEFAULT_LANG;

    const subdomain = host.split(".")[0];
    if (
      SUPPORTED_LANGUAGES.includes(
        subdomain as (typeof SUPPORTED_LANGUAGES)[number],
      )
    ) {
      return subdomain as (typeof SUPPORTED_LANGUAGES)[number];
    }
  } catch {
    // ignore
  }
  return DEFAULT_LANG;
}

export function getSubdomainByHostNameWithoutFallback(
  hostname?: string,
): string {
  try {
    const host =
      hostname ??
      (typeof window !== "undefined" ? window.location.hostname : null);
    if (!host) return "";
    const subdomain = host.split(".")[0];
    if (
      SUPPORTED_LANGUAGES.includes(
        subdomain as (typeof SUPPORTED_LANGUAGES)[number],
      )
    ) {
      return subdomain;
    }
  } catch {
    // ignore
  }
  return "";
}
