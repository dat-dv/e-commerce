import { ToastProvider } from "@/components/ui/toast";
import { CartDrawer } from "@/components/organisms/cart-drawer";
import { NotificationProvider } from "@/components/providers/notification-provider";
import React from "react";
import { AddressProvider } from "./address-provider";
import { AuthProvider } from "./auth-provider";
import { CartProvider } from "./cart-provider";
import { CategoriesProvider } from "./categories-provider";
import { ConfigProvider } from "./config-provider";
import { FavoritesProvider } from "./favorites-provider";
import { I18nProviderClient } from "./i18n-provider";
import { addressesUseCase } from "@/domain/addresses";
import { cartUseCase } from "@/domain/cart/use-cases";
import { categoriesUseCase } from "@/domain/categories/use-cases";
import { allSafe } from "@/utils/promise";
import { getSubdomainByHostname } from "@/utils/sub-domain/get-client-sub-domain";
import { getMessages } from "next-intl/server";
import RequireProfileInfoModal from "@/components/molecules/require-profile-info";

const AppProvider = async ({ children }: { children: React.ReactNode }) => {
  const [
    categoriesRes,
    language,
    initialCartState,
    initialAddressesState,
    messages,
  ] = await allSafe([
    categoriesUseCase.getTree.execute(),
    getSubdomainByHostname(),
    cartUseCase.getCart.execute(),
    addressesUseCase.getAddresses.execute(),
    getMessages(),
  ]);

  const categories =
    categoriesRes?.status === "success" ? categoriesRes.data : [];

  return (
    <I18nProviderClient locale={language!} messages={messages!}>
      <ConfigProvider initState={{ language: language! }}>
        <CategoriesProvider initState={{ categories }}>
          <AuthProvider>
            <NotificationProvider>
              <CartProvider initState={initialCartState?.data?.items || []}>
                <AddressProvider initState={initialAddressesState?.data || []}>
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
