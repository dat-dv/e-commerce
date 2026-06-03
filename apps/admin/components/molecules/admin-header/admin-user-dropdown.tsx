import { AvatarDropdown } from "@ecommerce/ui";
import Link from "next/link";

import { ProfileIcon } from "@/components/atoms/icons";
import { APP_ROUTES } from "@/constants/routes";
import { useAdminAuth } from "@/hooks/use-auth";
import { useAdminUserStore } from "@/store/user";

const USER_MENU_ITEMS = [
  {
    label: "Settings",
    href: `${APP_ROUTES.SETTINGS}?tab=profile`,
    icon: ProfileIcon,
  },
];

export const AdminUserDropdown = () => {
  const { user } = useAdminUserStore();
  const { logout } = useAdminAuth();

  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const userEmail = user?.email;
  const userAvatar = user?.avatar?.url || undefined;

  return (
    <AvatarDropdown
      name={userName}
      email={userEmail || ""}
      avatarUrl={userAvatar}
      menuItems={USER_MENU_ITEMS}
      labels={{
        menuLabel: "Admin user menu",
        fallbackUser: "Admin",
        noEmail: "No email",
        signOut: "Sign out",
      }}
      onClickLogout={logout}
      linkComponent={Link}
      popoverClassName="border-white/[0.06] bg-[var(--app-bg)] shadow-2xl shadow-black/30"
    />
  );
};

AdminUserDropdown.displayName = "AdminUserDropdown";
