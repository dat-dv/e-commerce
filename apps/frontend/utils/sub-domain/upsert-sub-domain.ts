export const upsertSubDomain = ({
  url,
  subDomain = "",
}: {
  url?: string;
  subDomain?: string;
}): string => {
  try {
    if (!url) throw new Error("URL is required.");
    if (!subDomain.trim()) return url;

    const parsedUrl = new URL(url);
    const parts = parsedUrl.hostname.split(".");

    // localhost
    if (parts.length === 1) {
      parsedUrl.hostname = `${subDomain}.${parts[0]}`;
      return parsedUrl.toString();
    }

    // replace existing subdomain
    parts[0] = subDomain;
    parsedUrl.hostname = parts.join(".");

    return parsedUrl.toString();
  } catch {
    throw new Error("Invalid URL: URL must be domain format.");
  }
};
