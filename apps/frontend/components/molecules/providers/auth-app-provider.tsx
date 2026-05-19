import AppToast from "@/components/atoms/toast";
import React from "react";
import { AuthProvider } from "./auth-provider";
import { ConfigProvider } from "./config-provider";
import { I18nProviderClient } from "./i18n-provider";
import { getSubdomainByHostname } from "@/utils/sub-domain/get-client-sub-domain";
import { getMessages } from "next-intl/server";
import { allSafe } from "@/utils/promise";
import RequireProfileInfoModal from "@/components/molecules/require-profile-info";

const AuthAppProvider = async ({ children }: { children: React.ReactNode }) => {
  const [language, messages] = await allSafe([
    getSubdomainByHostname(),
    getMessages(),
  ]);

  return (
    <I18nProviderClient locale={language!} messages={messages!}>
      <ConfigProvider initState={{ language: language! }}>
        <AuthProvider>
          <RequireProfileInfoModal />
          {children}
        </AuthProvider>
        <AppToast />
      </ConfigProvider>
    </I18nProviderClient>
  );
};

export default AuthAppProvider;
