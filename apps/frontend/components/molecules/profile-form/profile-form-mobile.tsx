"use client";

import { AnimationItem } from "@/components/atoms/animate";
import Button from "@/components/atoms/button";
import { FormDateInput } from "@/components/molecules/form/form-date-input";
import { FormInput } from "@/components/molecules/form/form-input";
import { FormPhoneInput } from "@/components/molecules/form/form-phone-input";
import { FormSelect } from "@/components/molecules/form/form-select";
import { TUser } from "@/domain/auth/types/auth.model";
import { TUpdateUserInput } from "@/domain/users/types/user.model";
import { useProfileFormLogic } from "@/hooks/profile/use-profile-form-logic";
import { Pencil } from "lucide-react";
import AppForm from "../form/app-form";
import FormListenerDirty from "../form/form-listener-dirty";
import AvatarWrapper from "./avatar-wapper";

interface IProfileFormMobileProps {
  user: Partial<TUser> | null;
  isLoading?: boolean;
  isUploading?: boolean;
  updateProfile: (user: TUpdateUserInput) => Promise<boolean | void>;
  uploadAvatar: (avatar: File) => Promise<boolean | void>;
}

export const ProfileFormMobile = ({
  user,
  isLoading,
  isUploading,
  updateProfile,
  uploadAvatar,
}: IProfileFormMobileProps) => {
  const {
    t,
    methods,
    isEditing,
    isFormDisabled,
    isSubmitLoading,
    translatedGenderOptions,
    enableEdit,
    disableEdit,
    handleSave,
  } = useProfileFormLogic({
    user,
    isLoading,
    isUploading,
    updateProfile,
    uploadAvatar,
  });

  if (!user) return null;

  return (
    <AppForm
      data-testid="profile-form-mobile"
      methods={methods}
      onSubmit={handleSave}
    >
      <div className="space-y-4 pb-28">
        {/* Avatar section — centered on mobile */}
        <div className="flex flex-col items-center gap-3 py-6 bg-white/80 dark:bg-surface/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg">
          <AvatarWrapper user={user} isFormDisabled={isFormDisabled} />
        </div>

        {/* Form fields — single column */}
        <div className="bg-white/80 dark:bg-surface/80 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-lg space-y-4">
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
            disabled={true}
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
      </div>

      {/* Sticky bottom action bar */}
      <AnimationItem className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-surface/90 backdrop-blur-md border-t border-content/10 shadow-2xl">
        {isEditing ? (
          <div className="flex gap-3">
            <FormListenerDirty>
              {(isDirty) => (
                <Button
                  onClick={methods.handleSubmit(handleSave)}
                  variant="primary"
                  size="lg"
                  className="flex-1 rounded-2xl bg-primary shadow-xl shadow-primary/25 text-white disabled:opacity-50"
                  disabled={isSubmitLoading || !isDirty}
                >
                  {isSubmitLoading ? t("form.updating") : t("form.updateBtn")}
                </Button>
              )}
            </FormListenerDirty>
            <Button
              onClick={disableEdit}
              variant="ghost"
              size="lg"
              className="rounded-2xl px-6 border border-content/10 hover:bg-content/5"
              disabled={isSubmitLoading}
            >
              {t("form.cancelBtn")}
            </Button>
          </div>
        ) : (
          <Button
            onClick={enableEdit}
            variant="primary"
            size="lg"
            className="w-full rounded-2xl shadow-xl shadow-primary/25 flex items-center justify-center gap-2"
            disabled={isSubmitLoading}
          >
            <Pencil className="w-4 h-4" />
            {t("form.editBtn")}
          </Button>
        )}
      </AnimationItem>
    </AppForm>
  );
};
