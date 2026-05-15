"use client";

import { ProfileForm } from "@/components/molecules/profile-form";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useUpdateProfile } from "@/hooks/profile/use-update-profile";
import { useUpLoadProfileAvatar } from "@/hooks/profile/use-upload-profile-avatar";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const { updateProfile, loading: isUpdating } = useUpdateProfile();
  const { uploadAvatar, isLoading: isUploading } = useUpLoadProfileAvatar();

  return (
    <ProfileForm
      user={user}
      updateProfile={updateProfile}
      uploadAvatar={uploadAvatar}
      isLoading={isUpdating}
      isUploading={isUploading}
    />
  );
}
