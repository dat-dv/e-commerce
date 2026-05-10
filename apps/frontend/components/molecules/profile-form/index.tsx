"use client";

import { AnimationItem } from "@/components/atoms/animate";
import Button from "@/components/atoms/button";
import { FormAvatarInput } from "@/components/molecules/form/form-avatar-input";
import { FormDateInput } from "@/components/molecules/form/form-date-input";
import { FormInput } from "@/components/molecules/form/form-input";
import { useProfile } from "@/hooks/profile/use-profile";

import AppForm from "../form/app-form";
import FormListenerDirty from "../form/form-listener-dirty";

export const ProfileForm = () => {
  const {
    user,
    methods,
    loading,
    isEditing,
    enableEdit,
    disableEdit,
    handleSave,
  } = useProfile();
  const isDisabled = loading || !isEditing;

  return (
    <AppForm data-testid="profile-form" methods={methods} onSubmit={handleSave}>
      <div className="space-y-12">
        <AnimationItem className="flex flex-col items-center text-center gap-6">
          <FormAvatarInput
            name="avatarUrl"
            displayName={user?.name}
            size={160}
            disabled={isDisabled}
          />

          <div className="space-y-1 text-content w-full max-w-md mx-auto">
            <FormInput
              name="name"
              variant="underline"
              disabled={isDisabled}
              autoComplete="name"
              className={
                "text-center text-4xl sm:text-5xl font-black tracking-tight"
              }
              placeholder="Your Name"
            />
            <p className="text-lg opacity-60 font-medium">{user?.email}</p>
          </div>
        </AnimationItem>

        {/* Form Fields Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            variant="underline"
            name="address"
            label="Address"
            placeholder="Your Address"
            autoComplete="street-address"
            disabled={isDisabled}
          />
          <FormDateInput
            variant="underline"
            name="dob"
            label="Date of Birth"
            placeholder="dd/mm/yyyy"
            disabled={isDisabled}
          />
        </div>

        {/* Form Actions Section */}
        <AnimationItem className="flex flex-wrap items-center justify-center gap-4 pt-6">
          {isEditing ? (
            <>
              <FormListenerDirty>
                {(isDirty) => (
                  <Button
                    onClick={methods.handleSubmit(handleSave)}
                    variant="primary"
                    size="lg"
                    className="rounded-2xl px-8 bg-primary shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all text-white disabled:opacity-50 disabled:hover:scale-100"
                    disabled={loading || !isDirty}
                  >
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                )}
              </FormListenerDirty>
              <Button
                onClick={disableEdit}
                variant="ghost"
                size="lg"
                className="rounded-2xl px-8 border border-content/5 hover:bg-content/5 transition-all"
                disabled={loading}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                href="/todo"
                variant="primary"
                size="lg"
                className="rounded-2xl px-8 shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all"
              >
                My Workspace
              </Button>
              <Button
                onClick={enableEdit}
                variant="ghost"
                size="lg"
                className="rounded-2xl px-8 border border-content/5 hover:bg-content/5 transition-all"
                disabled={loading}
              >
                Edit Profile
              </Button>
            </>
          )}
        </AnimationItem>
      </div>
    </AppForm>
  );
};
