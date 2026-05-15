"use client";

import { AnimationItem } from "@/components/atoms/animate";
import Button from "@/components/atoms/button";
import { FormAvatarInput } from "@/components/molecules/form/form-avatar-input";
import { FormDateInput } from "@/components/molecules/form/form-date-input";
import { FormInput } from "@/components/molecules/form/form-input";
import { FormSelect } from "@/components/molecules/form/form-select";
import { FormPhoneInput } from "@/components/molecules/form/form-phone-input";
import { Pencil } from "lucide-react";

import AppForm from "../form/app-form";
import FormListenerDirty from "../form/form-listener-dirty";
import { ProfileSchema, profileSchema } from "@/hooks/profile/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { TUser } from "@/domain/auth/types/auth.model";
import { GENDER_OPTIONS } from "@/constants/gender.constant";
import { TUpdateUserProfileInput } from "@/domain/users/infrastructure/user.model";

interface IProfileFormProps {
  user: Partial<TUser> | null;
  isLoading?: boolean;
  isUploading?: boolean;
  updateProfile: (user: TUpdateUserProfileInput) => Promise<boolean | void>;
  uploadAvatar: (avatar: File) => Promise<boolean | void>;
}

export const ProfileForm = ({
  user,
  isLoading,
  isUploading,
  updateProfile,
  uploadAvatar,
}: IProfileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const avatarRef = useRef(user?.avatar_id);
  const methods = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      dob: String(user?.date_of_birth || ""),
      avatarUrl: user?.avatar_url || "",
      phone: {
        phoneCode: user?.phone?.phone_code?.slice(0, 3) || "",
        phoneNumber: user?.phone?.phone_number || "",
      },
      gender: user?.gender ?? undefined,
    },
  });

  console.log("methods", methods.watch(), user);

  useEffect(() => {
    if (user) {
      methods.reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        dob: String(user.date_of_birth || ""),
        avatarUrl: user?.avatar_url || "",
        phone: {
          phoneCode: user?.phone?.phone_code?.slice(0, 3) || "",
          phoneNumber: user?.phone?.phone_number || "",
        },
        gender: user.gender ?? undefined,
      });
    }
  }, [user, methods]);

  const enableEdit = () => {
    setIsEditing(true);
  };

  const disableEdit = () => {
    if (user) {
      avatarRef.current = user.avatar_id;
      methods.reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        dob: String(user.date_of_birth || ""),
        avatarUrl: user?.avatar_url || "",
        phone: {
          phoneCode: user?.phone?.phone_code?.slice(0, 3) || "",
          phoneNumber: user?.phone?.phone_number || "",
        },
        gender: user.gender ?? undefined,
      });
    }
    setIsEditing(false);
  };

  const watchedFirstName = methods.watch("first_name");
  const watchedLastName = methods.watch("last_name");

  const fullName =
    `${watchedFirstName || ""} ${watchedLastName || ""}`.trim() ||
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
    "Your Name";

  const isFormDisabled = isLoading || isUploading || !isEditing;
  const isSubmitLoading = isLoading || isUploading;

  if (!user) return null;

  const handleSave = async (data: ProfileSchema) => {
    console.log("🚀 ~ ProfileForm ~ handleSave ~ data:", data);

    const finalAvatarUrl = data.avatarUrl;

    if (finalAvatarUrl && finalAvatarUrl.startsWith("data:image")) {
      const response = await fetch(finalAvatarUrl);
      const blob = await response.blob();
      const file = new File([blob], "avatar.jpg", { type: blob.type });

      await uploadAvatar(file);
    }

    const success = await updateProfile({
      id: user?.id || "",
      first_name: data.first_name,
      last_name: data.last_name,
      date_of_birth: data.dob,
      phone_number: data.phone?.phoneNumber || "",
      gender: data.gender,
      phone_code: data.phone?.phoneCode || "",
    });

    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <AppForm
      data-testid="profile-form"
      methods={methods}
      onSubmit={handleSave}
      onError={(errors) => {
        console.log("🚀 ~ ProfileForm ~ onError ~ errors:", errors);
      }}
    >
      <div className="space-y-12">
        {/* Form Fields Section */}
        <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl space-y-6">
          {/* Avatar & Name Header INSIDE the card! */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 border-b border-content/10">
            <FormAvatarInput
              name="avatarUrl"
              displayName={fullName}
              size={64}
              disabled={isFormDisabled}
            />

            <div className="space-y-1 text-content text-left w-full max-w-md">
              <p className="text-left text-xl font-bold tracking-tight">
                {fullName}
              </p>
              <p className="text-sm opacity-60 font-medium ml-1">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              variant="outline"
              name="first_name"
              label="First Name"
              placeholder="Your First Name"
              disabled={isFormDisabled}
              className="h-10 text-sm rounded-xl"
            />
            <FormInput
              variant="outline"
              name="last_name"
              label="Last Name"
              placeholder="Your Last Name"
              disabled={isFormDisabled}
              className="h-10 text-sm rounded-xl"
            />
            <FormPhoneInput
              name="phone"
              label="Phone Number"
              disabled={isFormDisabled}
              className="h-10 text-sm rounded-xl"
            />
            <FormDateInput
              variant="outline"
              name="dob"
              label="Date of Birth"
              placeholder="dd/mm/yyyy"
              disabled={isFormDisabled}
              className="h-10 text-sm rounded-xl"
            />
          </div>

          <FormSelect
            name="gender"
            label="Gender"
            disabled={isFormDisabled}
            options={GENDER_OPTIONS}
            className="h-10 text-sm rounded-xl"
          />

          <AnimationItem className="flex flex-wrap items-center justify-end gap-4 pt-6">
            {isEditing ? (
              <>
                <FormListenerDirty>
                  {(isDirty) => (
                    <Button
                      onClick={methods.handleSubmit(handleSave)}
                      variant="primary"
                      size="lg"
                      className="rounded-2xl px-8 bg-primary shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all text-white disabled:opacity-50 disabled:hover:scale-100"
                      disabled={isSubmitLoading || !isDirty}
                    >
                      {isSubmitLoading ? "Updating..." : "Update Profile"}
                    </Button>
                  )}
                </FormListenerDirty>
                <Button
                  onClick={disableEdit}
                  variant="ghost"
                  size="lg"
                  className="rounded-2xl px-8 border border-content/5 hover:bg-content/5 transition-all"
                  disabled={isSubmitLoading}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={enableEdit}
                variant="primary"
                size="lg"
                className="rounded-2xl px-12 shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                disabled={isSubmitLoading}
              >
                <Pencil className="w-4 h-4" />
                Edit Profile
              </Button>
            )}
          </AnimationItem>
        </div>
      </div>
    </AppForm>
  );
};
