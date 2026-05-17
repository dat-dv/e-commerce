"use client";

import { ProfileForm } from "@/components/molecules/profile-form";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useUpdateProfile } from "@/hooks/profile/use-update-profile";
import { useUpLoadProfileAvatar } from "@/hooks/profile/use-upload-profile-avatar";
import { DiscoveryCarouselSection } from "@/components/organisms/discovery-sections";

export const ProfileView = () => {
  const user = useAuthStore((state) => state.user);
  const { updateProfile, loading: isUpdating } = useUpdateProfile();
  const { uploadAvatar, isLoading: isUploading } = useUpLoadProfileAvatar();

  return (
    <div className="space-y-12">
      <ProfileForm
        user={user}
        updateProfile={updateProfile}
        uploadAvatar={uploadAvatar}
        isLoading={isUpdating}
        isUploading={isUploading}
      />
      <DiscoveryCarouselSection />
    </div>
  );
};
