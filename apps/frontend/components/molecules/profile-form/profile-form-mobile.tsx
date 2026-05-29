"use client";

import { Button, FormCard } from "@ecommerce/ui";

import { FormDateInput } from "@ecommerce/ui";
import { FormInput } from "@ecommerce/ui";
import { FormPhoneInput } from "@ecommerce/ui";
import { FormSelect } from "@ecommerce/ui";
import { TUser } from "@/domain/auth/types/auth.model";
import { TUpdateUserInput } from "@/domain/users/types/user.model";
import { useProfileFormLogic } from "@/hooks/profile/use-profile-form-logic";
import { Pencil } from "lucide-react";
import { AppForm } from "@ecommerce/ui";
import { FormListenerDirty } from "@ecommerce/ui";
import AvatarWrapper from "./avatar-wapper";

interface IProfileFormMobileProps {
  user: Partial<TUser> | null;
  isLoading?: boolean;
  updateProfile: (user: TUpdateUserInput) => Promise<boolean | void>;
}

export const ProfileFormMobile = ({
  user,
  isLoading,
  updateProfile,
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
    updateProfile,
  });

  if (!user) return null;

  return (
    <AppForm
      data-testid="profile-form-mobile"
      methods={methods}
      onSubmit={handleSave}
    >
      <div className="min-w-0 space-y-4">
        {/* Avatar section — centered on mobile */}
        <FormCard className="flex flex-col items-center gap-3 py-6">
          <AvatarWrapper
            user={user}
            isFormDisabled={isFormDisabled}
            className="align-center [&_p]:text-center"
          />
        </FormCard>
        {/* Form fields — single column */}
        <FormCard className="space-y-4">
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
          {/* Sticky bottom action bar */}
          <div className="mt-4">
            {isEditing ? (
              <div className="grid grid-cols-1 gap-3 sm:flex">
                <FormListenerDirty>
                  {(isDirty) => (
                    <Button
                      onClick={methods.handleSubmit(handleSave)}
                      variant="primary"
                      size="lg"
                      className="bg-primary shadow-primary/25 w-full rounded-2xl text-white shadow-xl disabled:opacity-50 sm:flex-1"
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
                  className="border-content/10 hover:bg-content/5 w-full rounded-2xl border px-6 sm:w-auto"
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
                className="shadow-primary/25 flex w-full items-center justify-center gap-2 rounded-2xl shadow-xl"
                disabled={isSubmitLoading}
              >
                <Pencil className="h-4 w-4" />
                {t("form.editBtn")}
              </Button>
            )}
          </div>
        </FormCard>
      </div>
    </AppForm>
  );
};
