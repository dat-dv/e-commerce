import { ToastProvider } from "@/components/atoms/toast";
import RequireProfileInfoModal from "@/components/molecules/require-profile-info";
import { CartDrawer } from "@/components/organisms/cart-drawer";
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
import { NotificationProvider } from "./notification-provider";
import NotificationSetup from "./notification-setup";
import { PwaRegister } from "./pwa-register";

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
      <PwaRegister />
      <ConfigProvider initState={{ language: language! }}>
        <CategoriesProvider initState={{ categories }}>
          <AuthProvider initState={{ user: authRes?.data, hasHydrated: true }}>
            <CartProvider initState={cartRes?.data?.items || []}>
              <AddressProvider initState={addressRes?.data || []}>
                <FavoritesProvider>
                  <NotificationProvider>
                    <RequireProfileInfoModal />
                    {children}
                    <NotificationSetup />
                    <CartDrawer />
                  </NotificationProvider>
                </FavoritesProvider>
              </AddressProvider>
            </CartProvider>
          </AuthProvider>
        </CategoriesProvider>
        <ToastProvider />
      </ConfigProvider>
    </I18nProviderClient>
  );
};

export default AppProvider;
