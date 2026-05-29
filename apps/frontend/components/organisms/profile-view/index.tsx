"use client";

import { ProfileFormDesktop } from "@/components/molecules/profile-form/profile-form-desktop";
import { ProfileFormMobile } from "@/components/molecules/profile-form/profile-form-mobile";
import { RenderMobileOnly, RenderTabletAndAbove } from "@ecommerce/ui";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useUpdateProfile } from "@/hooks/profile/use-update-profile";

export const ProfileView = () => {
  const user = useAuthStore((state) => state.user);
  const { updateProfile, loading: isUpdating } = useUpdateProfile();

  return (
    <>
      <RenderTabletAndAbove>
        <div className="space-y-12">
          <ProfileFormDesktop
            user={user}
            updateProfile={updateProfile}
            isLoading={isUpdating}
          />
        </div>
      </RenderTabletAndAbove>

      <RenderMobileOnly>
        <ProfileFormMobile
          user={user}
          updateProfile={updateProfile}
          isLoading={isUpdating}
        />
      </RenderMobileOnly>
    </>
  );
};
