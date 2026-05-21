"use client";

import { AnimationItem } from "@/components/atoms/animate";
import Button from "@/components/atoms/button";
import { FormCard } from "@/components/atoms/form-card";
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
      <FormCard className="space-y-6">
        <AvatarWrapper user={user} isFormDisabled={isFormDisabled} />

        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
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

        <AnimationItem className="flex min-w-0 flex-col-reverse items-stretch justify-end gap-3 pt-6 sm:flex-row sm:items-center sm:gap-4">
          {isEditing ? (
            <>
              <FormListenerDirty>
                {(isDirty) => (
                  <Button
                    onClick={methods.handleSubmit(handleSave)}
                    variant="primary"
                    size="lg"
                    className="w-full rounded-2xl bg-primary px-8 text-white shadow-xl shadow-primary/25 transition-all active:scale-95 disabled:opacity-50 sm:w-auto sm:hover:scale-105 sm:disabled:hover:scale-100"
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
                className="w-full rounded-2xl border border-content/5 px-8 transition-all hover:bg-content/5 sm:w-auto"
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
              className="flex w-full items-center justify-center gap-2 rounded-2xl px-12 shadow-xl shadow-primary/25 transition-all active:scale-95 sm:w-auto sm:hover:scale-105"
              disabled={isSubmitLoading}
            >
              <Pencil className="w-4 h-4" />
              {t("form.editBtn")}
            </Button>
          )}
        </AnimationItem>
      </FormCard>
    </AppForm>
  );
};
