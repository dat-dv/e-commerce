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
import { TUpdateUserInput } from "@/domain/users/types/user.model";

interface IProfileFormProps {
  user: Partial<TUser> | null;
  isLoading?: boolean;
  isUploading?: boolean;
  updateProfile: (user: TUpdateUserInput) => Promise<boolean | void>;
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

  const avatarRef = useRef(user?.avatarId);
  const methods = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      dateOfBirth: String(user?.dateOfBirth || ""),
      avatarUrl: user?.avatarUrl || "",
      phone: {
        phoneCode: user?.phones?.[0]?.phoneCode?.slice(0, 3) || "",
        phoneNumber: user?.phones?.[0]?.phoneNumber || "",
      },
      email: user?.email || "",
      avatarId: user?.avatarId || "",
      gender: user?.gender === null ? undefined : user?.gender,
    },
  });

  console.log("methods", methods.watch(), user);

  useEffect(() => {
    if (user) {
      methods.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dateOfBirth: String(user.dateOfBirth || ""),
        avatarUrl: user?.avatarUrl || "",
        phone: {
          phoneCode: user?.phones?.[0]?.phoneCode?.slice(0, 3) || "",
          phoneNumber: user?.phones?.[0]?.phoneNumber || "",
        },
        email: user.email || "",
        avatarId: user.avatarId || "",
        gender: user.gender === null ? undefined : user.gender,
      });
    }
  }, [user, methods]);

  const enableEdit = () => {
    setIsEditing(true);
  };

  const disableEdit = () => {
    if (user) {
      avatarRef.current = user.avatarId;
      methods.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dateOfBirth: String(user.dateOfBirth || ""),
        avatarUrl: user?.avatarUrl || "",
        phone: {
          phoneCode: user?.phones?.[0]?.phoneCode?.slice(0, 3) || "",
          phoneNumber: user?.phones?.[0]?.phoneNumber || "",
        },
        email: user.email || "",
        avatarId: user.avatarId || "",
        gender: user.gender === null ? undefined : user.gender,
      });
    }
    setIsEditing(false);
  };

  const watchedFirstName = methods.watch("firstName");
  const watchedLastName = methods.watch("lastName");

  const fullName =
    `${watchedFirstName || ""} ${watchedLastName || ""}`.trim() ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
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
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth || "",
      phoneNumber: data.phone?.phoneNumber || "",
      gender: data.gender ?? undefined,
      phoneCode: data.phone?.phoneCode || "",
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
              name="firstName"
              label="First Name"
              placeholder="Your First Name"
              disabled={isFormDisabled}
              className="h-10 text-sm rounded-xl"
            />
            <FormInput
              variant="outline"
              name="lastName"
              label="Last Name"
              placeholder="Your Last Name"
              disabled={isFormDisabled}
              className="h-10 text-sm rounded-xl"
            />
            <FormInput
              variant="outline"
              name="email"
              label="Email Address"
              placeholder="Your Email"
              disabled={true} // Email is read-only in profile
              className="h-10 text-sm rounded-xl opacity-60"
            />
            <FormPhoneInput
              name="phone"
              label="Phone Number"
              disabled={isFormDisabled}
              className="h-10 text-sm rounded-xl"
            />
            <FormDateInput
              variant="outline"
              name="dateOfBirth"
              label="Date of Birth"
              placeholder="dd/mm/yyyy"
              disabled={isFormDisabled}
              className="h-10 text-sm rounded-xl"
            />
            <FormSelect
              name="gender"
              label="Gender"
              disabled={isFormDisabled}
              options={GENDER_OPTIONS}
              className="h-10 text-sm rounded-xl"
            />
          </div>

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
