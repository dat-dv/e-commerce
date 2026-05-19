import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";
import { getSubdomainByHostname } from "@/utils/sub-domain/get-client-sub-domain";

export default getRequestConfig(async () => {
  const headerStore = await headers();
  const host = headerStore.get("host") ?? undefined;
  const locale = getSubdomainByHostname(host);

  const [auth, common, validation] = await Promise.all([
    import(`../messages/${locale}/auth.json`),
    import(`../messages/${locale}/common.json`),
    import(`../messages/${locale}/validation.json`),
  ]);

  return {
    locale,
    messages: {
      ...auth.default,
      ...common.default,
      ...validation.default,
    },
  };
});
