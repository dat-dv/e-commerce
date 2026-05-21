import RequireProfileInfoModal from "@/components/molecules/require-profile-info";
import { CartDrawer } from "@/components/organisms/cart-drawer";
import { NotificationProvider } from "@/components/providers/notification-provider";
import { ToastProvider } from "@/components/ui/toast";
import { addressesUseCase } from "@/domain/addresses";
import { authUseCase } from "@/domain/auth/use-cases";
import { cartUseCase } from "@/domain/cart/use-cases";
import { categoriesUseCase } from "@/domain/categories/use-cases";
import { allSafe } from "@/utils/promise";
import { getServerSubdomain } from "@/utils/sub-domain/get-server-sub-domain";
import { getMessages } from "next-intl/server";
import React from "react";
import { AddressProvider } from "./address-provider";
import { AuthProvider } from "./auth-provider";
import { CartProvider } from "./cart-provider";
import { CategoriesProvider } from "./categories-provider";
import { ConfigProvider } from "./config-provider";
import { FavoritesProvider } from "./favorites-provider";
import { I18nProviderClient } from "./i18n-provider";

const AppProvider = async ({ children }: { children: React.ReactNode }) => {
  const [language, categoriesRes] = await allSafe([
    getServerSubdomain(),
    categoriesUseCase.getTree.execute(),
  ]);

  const [cartRes, addressRes, messages, authRes] = await allSafe([
    cartUseCase.getCart.execute(),
    addressesUseCase.getAddresses.execute(),
    getMessages({ locale: language! }),
    authUseCase.fetchMe.execute(),
  ]);

  const categories =
    categoriesRes?.status === "success" ? categoriesRes.data : [];

  return (
    <I18nProviderClient locale={language!} messages={messages!}>
      <ConfigProvider initState={{ language: language! }}>
        <CategoriesProvider initState={{ categories }}>
          <AuthProvider initState={{ user: authRes?.data, hasHydrated: true }}>
            <NotificationProvider>
              <CartProvider initState={cartRes?.data?.items || []}>
                <AddressProvider initState={addressRes?.data || []}>
                  <FavoritesProvider>
                    <RequireProfileInfoModal />
                    {children}
                    <CartDrawer />
                  </FavoritesProvider>
                </AddressProvider>
              </CartProvider>
            </NotificationProvider>
          </AuthProvider>
        </CategoriesProvider>
        <ToastProvider />
      </ConfigProvider>
    </I18nProviderClient>
  );
};

export default AppProvider;
