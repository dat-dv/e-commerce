import { Avatar, Button } from "@ecommerce/ui";
import { useRouter } from "next/navigation";

import {
  ChevronDownIcon,
  LogOutIcon,
  PreferencesIcon,
  ProfileIcon,
} from "@/components/atoms/icons";
import { APP_ROUTES } from "@/constants/routes";
import { useAdminAuth } from "@/hooks/use-auth";
import { useAdminUserStore } from "@/store/user";

interface IAdminUserDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const AdminUserDropdown = ({
  isOpen,
  onToggle,
  onClose,
}: IAdminUserDropdownProps) => {
  const { user } = useAdminUserStore();
  const { logout } = useAdminAuth();
  const router = useRouter();

  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const userEmail = user?.email;
  const userAvatar = user?.avatar?.url || undefined;

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  return (
    <div className="relative">
      <button
        type="button"
        id="admin-user-menu-trigger"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-white/8"
      >
        <div className="from-primary/80 to-primary h-7 w-7 rounded-full bg-gradient-to-br ring-2 ring-white/10">
          <Avatar name={userName} url={userAvatar} size={28} />
        </div>
        <div className="hidden text-left md:block">
          <p className="text-xs leading-tight font-semibold text-[var(--app-text)]">
            {userName}
          </p>
          <p className="text-[11px] leading-tight text-[var(--muted)]">
            {userEmail}
          </p>
        </div>
        <ChevronDownIcon
          className={`hidden h-3.5 w-3.5 text-[var(--muted)] transition-transform md:block ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            aria-hidden="true"
            onClick={onClose}
          />
          <div
            role="menu"
            aria-labelledby="admin-user-menu-trigger"
            className="absolute right-0 z-50 mt-2 w-52 origin-top-right rounded-xl border border-white/[0.06] bg-[var(--app-bg)] shadow-2xl shadow-black/30 backdrop-blur-xl"
          >
            {/* Profile info */}
            <div className="border-b border-white/[0.06] px-4 py-3">
              <p className="text-xs font-semibold text-[var(--app-text)]">
                {userName}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-[var(--muted)]">
                {userEmail}
              </p>
            </div>

            {/* Menu items */}
            <div className="p-1">
              {[
                {
                  label: "Profile settings",
                  icon: ProfileIcon,
                  id: "admin-menu-profile",
                },
                {
                  label: "Preferences",
                  icon: PreferencesIcon,
                  id: "admin-menu-preferences",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    id={item.id}
                    role="menuitem"
                    type="button"
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-[var(--app-text)] transition-colors hover:bg-white/8"
                    onClick={() => {
                      onClose();
                      if (item.id === "admin-menu-profile") {
                        router.push(`${APP_ROUTES.SETTINGS}?tab=profile`);
                      } else if (item.id === "admin-menu-preferences") {
                        router.push(`${APP_ROUTES.SETTINGS}?tab=appearance`);
                      }
                    }}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-[var(--muted)]" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Sign out */}
            <div className="border-t border-white/[0.06] p-1">
              <Button
                id="admin-menu-sign-out"
                role="menuitem"
                variant="danger"
                className="w-full justify-start gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
                onClick={handleLogout}
              >
                <LogOutIcon className="h-4 w-4 shrink-0" />
                Sign out
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

AdminUserDropdown.displayName = "AdminUserDropdown";
