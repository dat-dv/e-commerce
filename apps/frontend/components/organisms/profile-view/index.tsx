"use client";

import { Clock, Heart, Sparkles } from "lucide-react";

import { ProfileForm } from "@/components/molecules/profile-form";
import { APP_ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useFavorites } from "@/hooks/favorites/use-favorites";
import { useLoadRecentViewedProducts } from "@/hooks/products/recent-viewed/use-load-recent-viewed-product";
import { useRecommendedProducts } from "@/hooks/products/use-recommended-products";
import { useUpdateProfile } from "@/hooks/profile/use-update-profile";
import { useUpLoadProfileAvatar } from "@/hooks/profile/use-upload-profile-avatar";
import { ProductListPreview } from "@/components/molecules/product-preview-list";

export const ProfileView = () => {
  const user = useAuthStore((state) => state.user);
  const { updateProfile, loading: isUpdating } = useUpdateProfile();
  const { uploadAvatar, isLoading: isUploading } = useUpLoadProfileAvatar();
  const { favorites } = useFavorites();
  const { recentViewedProducts } = useLoadRecentViewedProducts();
  const { recommendedProducts } = useRecommendedProducts();

  return (
    <div className="space-y-6">
      <ProfileForm
        user={user}
        updateProfile={updateProfile}
        uploadAvatar={uploadAvatar}
        isLoading={isUpdating}
        isUploading={isUploading}
      />
    </div>
  );
};
