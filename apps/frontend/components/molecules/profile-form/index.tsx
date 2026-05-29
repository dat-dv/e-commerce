"use client";

import { AnimationItem, Button } from "@ecommerce/ui";

import { FormDateInput } from "@/components/molecules/form/form-date-input";
import { FormInput } from "@/components/molecules/form/form-input";
import { FormPhoneInput } from "@/components/molecules/form/form-phone-input";
import { FormSelect } from "@/components/molecules/form/form-select";
import { Pencil } from "lucide-react";

import { TUser } from "@/domain/auth/types/auth.model";
import { TUpdateUserInput } from "@/domain/users/types/user.model";
import {
  getProfileSchema,
  ProfileSchema,
} from "@/hooks/profile/profile.schema";
import { EGender } from "@ecommerce/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import AppForm from "../form/app-form";
import FormListenerDirty from "../form/form-listener-dirty";
import AvatarWrapper from "./avatar-wapper";

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
  const t = useTranslations("ProfilePage");
  const tValidation = useTranslations("Validation");
  const [isEditing, setIsEditing] = useState(false);

  const avatarRef = useRef(user?.avatarId);
  const schema = useMemo(() => getProfileSchema(tValidation), [tValidation]);
  const methods = useForm<ProfileSchema>({
    resolver: zodResolver(schema),
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

  const translatedGenderOptions = useMemo(
    () => [
      { label: t("form.genders.male"), value: EGender.MALE },
      { label: t("form.genders.female"), value: EGender.FEMALE },
      { label: t("form.genders.other"), value: EGender.OTHER },
    ],
    [t],
  );

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

  const isFormDisabled = isLoading || isUploading || !isEditing;
  const isSubmitLoading = isLoading || isUploading;

  if (!user) return null;

  const handleSave = async (data: ProfileSchema) => {
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
    <AppForm data-testid="profile-form" methods={methods} onSubmit={handleSave}>
      <div className="space-y-12">
        {/* Form Fields Section */}
        <div className="space-y-6 rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-md">
          {/* Avatar & Name Header INSIDE the card! */}
          <AvatarWrapper user={user} isFormDisabled={isFormDisabled} />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              variant="outline"
              name="firstName"
              label={t("form.firstNameLabel")}
              placeholder={t("form.firstNamePlaceholder")}
              disabled={isFormDisabled}
              size="md"
            />
            <FormInput
              variant="outline"
              name="lastName"
              label={t("form.lastNameLabel")}
              placeholder={t("form.lastNamePlaceholder")}
              disabled={isFormDisabled}
              size="md"
            />
            <FormInput
              variant="outline"
              name="email"
              label={t("form.emailLabel")}
              placeholder={t("form.emailPlaceholder")}
              disabled={true} // Email is read-only in profile
              size="md"
              className="opacity-60"
            />
            <FormPhoneInput
              name="phone"
              label={t("form.phoneLabel")}
              disabled={isFormDisabled}
              size="md"
            />
            <FormDateInput
              variant="outline"
              name="dateOfBirth"
              label={t("form.dateOfBirthLabel")}
              placeholder={t("form.dateOfBirthPlaceholder")}
              disabled={isFormDisabled}
              size="md"
            />
            <FormSelect
              name="gender"
              label={t("form.genderLabel")}
              disabled={isFormDisabled}
              options={translatedGenderOptions}
              size="md"
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
                      className="bg-primary shadow-primary/25 rounded-2xl px-8 text-white shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                      disabled={isSubmitLoading || !isDirty}
                    >
                      {isSubmitLoading
                        ? t("form.updating")
                        : t("form.updateBtn")}
                    </Button>
                  )}
                </FormListenerDirty>
                <Button
                  onClick={disableEdit}
                  variant="ghost"
                  size="lg"
                  className="border-content/5 hover:bg-content/5 rounded-2xl border px-8 transition-all"
                  disabled={isSubmitLoading}
                >
                  {t("form.cancelBtn")}
                </Button>
              </>
            ) : (
              <Button
                onClick={enableEdit}
                variant="primary"
                size="lg"
                className="shadow-primary/25 flex items-center gap-2 rounded-2xl px-12 shadow-xl transition-all hover:scale-105 active:scale-95"
                disabled={isSubmitLoading}
              >
                <Pencil className="h-4 w-4" />
                {t("form.editBtn")}
              </Button>
            )}
          </AnimationItem>
        </div>
      </div>
    </AppForm>
  );
};
