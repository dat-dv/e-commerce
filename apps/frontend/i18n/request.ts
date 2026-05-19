import { getRequestConfig } from "next-intl/server";
import { getServerSubdomain } from "@/utils/sub-domain/get-server-sub-domain";

export default getRequestConfig(async () => {
  const locale = await getServerSubdomain();

  const res = await Promise.all([
    import(`../messages/${locale}/auth.json`),
    import(`../messages/${locale}/common.json`),
    import(`../messages/${locale}/validation.json`),
    import(`../messages/${locale}/homepage.json`),
    import(`../messages/${locale}/search.json`),
    import(`../messages/${locale}/privacy.json`),
    import(`../messages/${locale}/terms.json`),
    import(`../messages/${locale}/products.json`),
    import(`../messages/${locale}/settings.json`),
    import(`../messages/${locale}/profile.json`),
    import(`../messages/${locale}/vouchers.json`),
    import(`../messages/${locale}/new-arrivals.json`),
    import(`../messages/${locale}/flash-sale.json`),
    import(`../messages/${locale}/brands.json`),
    import(`../messages/${locale}/categories.json`),
    import(`../messages/${locale}/cart.json`),
    import(`../messages/${locale}/checkout.json`),
    import(`../messages/${locale}/orders.json`),
  ]);

  const messages = res.reduce((acc, item) => {
    return { ...acc, ...item.default };
  }, {});
  return {
    locale,
    messages,
  };
});
