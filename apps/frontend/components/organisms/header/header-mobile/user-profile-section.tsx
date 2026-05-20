"use client";

import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";

interface IUserProfileSectionProps {
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
  onClose: () => void;
}

export default function UserProfileSection({
  user,
  onClose,
}: IUserProfileSectionProps) {
  const t = useTranslations("Common.header");

  return (
    <div className="mb-8 p-4 rounded-2xl bg-content/[0.03] border border-content/[0.05]">
      {user ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg uppercase">
              {user.firstName ? user.firstName[0] : <User size={18} />}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold truncate text-content">
                {`${user.firstName || ""} ${user.lastName || ""}`}
              </span>
              <span className="text-xs text-content/50 truncate">
                {user.email}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-semibold text-content/40 uppercase tracking-wider mb-1">
            {t("signIn") || "Account"}
          </span>
          <Button
            variant="ghost"
            href={APP_ROUTES.SIGN_IN}
            onClick={onClose}
            className="w-full justify-center h-10 text-sm border border-content/10"
          >
            {t("signIn")}
          </Button>
          <Button
            variant="primary"
            href={APP_ROUTES.SIGN_UP}
            onClick={onClose}
            className="w-full justify-center h-10 text-sm shadow-md"
          >
            {t("signUp")}
          </Button>
        </div>
      )}
    </div>
  );
}
