import { ToastProvider } from "@/components/ui/toast";
import React from "react";
import { ConfigProvider } from "./config-provider";
import { I18nProviderClient } from "./i18n-provider";
import { getMessages } from "next-intl/server";
import { AuthProvider } from "./auth-provider";
import { CartProvider } from "./cart-provider";
import { AddressProvider } from "./address-provider";
import { FavoritesProvider } from "./favorites-provider";
import { CategoriesProvider } from "./categories-provider";
import RequireProfileInfoModal from "@/components/molecules/require-profile-info";

const LocalizedAppProvider = async ({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) => {
  let messages;
  try {
    messages = await getMessages({ locale });
  } catch (error) {
    console.error("FAILED TO LOAD MESSAGES FOR LOCALE:", locale, error);
  }

  return (
    <I18nProviderClient locale={locale} messages={messages!}>
      <ConfigProvider initState={{ language: locale }}>
        <CategoriesProvider initState={{ categories: [] }}>
          <AuthProvider initState={{ hasHydrated: true, user: null }}>
            <CartProvider initState={[]}>
              <AddressProvider initState={[]}>
                <FavoritesProvider>
                  <RequireProfileInfoModal />
                  {children}
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

export default LocalizedAppProvider;
