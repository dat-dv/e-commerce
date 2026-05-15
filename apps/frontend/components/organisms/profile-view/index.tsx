import { AnimationContainer } from "@/components/atoms/animate";
import SidebarLayout from "@/components/molecules/sidebar-layout";
import { Bell, User, ShoppingBag, ShoppingCart } from "lucide-react";
import { ProfileForm } from "../../molecules/profile-form";
import Link from "next/link";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useUpdateProfile } from "@/hooks/profile/use-update-profile";
import { useUpLoadProfileAvatar } from "@/hooks/profile/use-upload-profile-avatar";

export const ProfileView = () => {
  const user = useAuthStore((state) => state.user);
  const { updateProfile, loading: isUpdating } = useUpdateProfile();
  const { uploadAvatar, isLoading: isUploading } = useUpLoadProfileAvatar();

  const sidebarContent = (
    <div className="space-y-6">
      {/* Account Section */}
      <div>
        <h3 className="font-bold text-content mb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-content/60" />
          My Account
        </h3>
        <ul className="space-y-2 ml-7">
          <li>
            <Link
              href="/profile"
              className="text-primary font-medium flex items-center gap-2"
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              href="/profile/bank"
              className="text-content/60 hover:text-content font-medium flex items-center gap-2"
            >
              Bank Account
            </Link>
          </li>
          <li>
            <Link
              href="/profile/address"
              className="text-content/60 hover:text-content font-medium flex items-center gap-2"
            >
              Addresses
            </Link>
          </li>
          <li>
            <Link
              href="/profile/password"
              className="text-content/60 hover:text-content font-medium flex items-center gap-2"
            >
              Change Password
            </Link>
          </li>
        </ul>
      </div>

      {/* Notifications */}
      <div>
        <Link
          href="/notifications"
          className="font-bold text-content flex items-center gap-2 hover:text-primary transition-colors"
        >
          <Bell className="w-5 h-5 text-content/60" />
          Notifications
        </Link>
      </div>

      {/* Purchase History */}
      <div>
        <Link
          href="/orders"
          className="font-bold text-content flex items-center gap-2 hover:text-primary transition-colors"
        >
          <ShoppingBag className="w-5 h-5 text-content/60" />
          My Purchases
        </Link>
      </div>

      {/* Cart */}
      <div>
        <Link
          href="/cart"
          className="font-bold text-content flex items-center gap-2 hover:text-primary transition-colors"
        >
          <ShoppingCart className="w-5 h-5 text-content/60" />
          My Cart
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-80px)] pt-10 bg-gradient-to-b from-surface to-transparent">
      <SidebarLayout header={null} sidebar={sidebarContent}>
        <AnimationContainer className="space-y-12">
          <ProfileForm
            user={user}
            updateProfile={updateProfile}
            uploadAvatar={uploadAvatar}
            isLoading={isUpdating}
            isUploading={isUploading}
          />
        </AnimationContainer>
      </SidebarLayout>
    </div>
  );
};
