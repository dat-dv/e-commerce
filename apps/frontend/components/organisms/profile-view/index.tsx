"use client";

import { ProfileFormDesktop } from "@/components/molecules/profile-form/profile-form-desktop";
import { ProfileFormMobile } from "@/components/molecules/profile-form/profile-form-mobile";
import {
  RenderMobileOnly,
  RenderTabletAndAbove,
} from "@/components/molecules/responsive";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useUpdateProfile } from "@/hooks/profile/use-update-profile";
import { useUpLoadProfileAvatar } from "@/hooks/profile/use-upload-profile-avatar";
import { ProfileViewMobileSkeleton } from "./profile-view-mobile.skeleton";
import { ProfileViewTabletAboveSkeleton } from "./profile-view-tablet-above.skeleton";

export const ProfileView = () => {
  const user = useAuthStore((state) => state.user);
  const { updateProfile, loading: isUpdating } = useUpdateProfile();
  const { uploadAvatar, isLoading: isUploading } = useUpLoadProfileAvatar();

  return (
    <>
      <RenderTabletAndAbove fallback={<ProfileViewTabletAboveSkeleton />}>
        <div className="space-y-12">
          <ProfileFormDesktop
            user={user}
            updateProfile={updateProfile}
            uploadAvatar={uploadAvatar}
            isLoading={isUpdating}
            isUploading={isUploading}
          />
        </div>
      </RenderTabletAndAbove>

      <RenderMobileOnly fallback={<ProfileViewMobileSkeleton />}>
        <ProfileFormMobile
          user={user}
          updateProfile={updateProfile}
          uploadAvatar={uploadAvatar}
          isLoading={isUpdating}
          isUploading={isUploading}
        />
      </RenderMobileOnly>
    </>
  );
};
