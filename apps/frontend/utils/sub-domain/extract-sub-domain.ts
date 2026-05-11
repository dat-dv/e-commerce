export function getLanguageSubdomain() {
  if (typeof window === "undefined") return null;

  try {
    const url = new URL(window.location.href);
    const hostParts = url.hostname.split(".");
    if (hostParts[0].length <= 3) return hostParts[0];
  } catch {
    return null;
  }

  return null;
}
