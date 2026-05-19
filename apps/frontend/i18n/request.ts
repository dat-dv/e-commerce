import { getSubdomainByHostname } from "@/utils/sub-domain/get-client-sub-domain";
import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

export default getRequestConfig(async () => {
  const headerStore = await headers();
  const host = headerStore.get("host") ?? undefined;
  const locale = getSubdomainByHostname(host);
  const messages =
    locale === "en"
      ? (await import("../messages/en.json")).default
      : (await import("../messages/vi.json")).default;

  return {
    locale,
    messages: messages,
  };
});
