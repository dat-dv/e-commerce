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

interface IProfileFormDesktopProps {
  user: Partial<TUser> | null;
  isLoading?: boolean;
  isUploading?: boolean;
  updateProfile: (user: TUpdateUserInput) => Promise<boolean | void>;
  uploadAvatar: (avatar: File) => Promise<boolean | void>;
}

export const ProfileFormDesktop = ({
  user,
  isLoading,
  isUploading,
  updateProfile,
  uploadAvatar,
}: IProfileFormDesktopProps) => {
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
      data-testid="profile-form-desktop"
      methods={methods}
      onSubmit={handleSave}
    >
      <div className="bg-white/80 dark:bg-surface/80 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl space-y-6">
        <AvatarWrapper user={user} isFormDisabled={isFormDisabled} />

        <div className="grid grid-cols-2 gap-4">
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
                    {isSubmitLoading ? t("form.updating") : t("form.updateBtn")}
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
                {t("form.cancelBtn")}
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
              {t("form.editBtn")}
            </Button>
          )}
        </AnimationItem>
      </div>
    </AppForm>
  );
};
