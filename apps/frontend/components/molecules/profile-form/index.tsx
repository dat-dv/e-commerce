"use client";

import { AnimationItem } from "@/components/atoms/animate";
import Button from "@/components/atoms/button";
import { FormAvatarInput } from "@/components/molecules/form/form-avatar-input";
import { FormDateInput } from "@/components/molecules/form/form-date-input";
import { FormInput } from "@/components/molecules/form/form-input";
import { FormPhoneInput } from "@/components/molecules/form/form-phone-input";
import { FormSelect } from "@/components/molecules/form/form-select";
import { useProfile } from "@/hooks/profile/use-profile";
import { Pencil } from "lucide-react";

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
  const watchedFirstName = methods.watch("first_name");
  const watchedLastName = methods.watch("last_name");

  return (
    <AppForm data-testid="profile-form" methods={methods} onSubmit={handleSave}>
      <div className="space-y-12">
        {/* Form Fields Section */}
        <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl space-y-6">
          {/* Avatar & Name Header INSIDE the card! */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 border-b border-content/10">
            <FormAvatarInput
              name="avatarUrl"
              displayName={
                `${watchedFirstName || ""} ${watchedLastName || ""}`.trim() ||
                user?.first_name + " " + user?.last_name
              }
              size={64}
              disabled={isDisabled}
            />

            <div className="space-y-1 text-content text-left w-full max-w-md">
              <p className="text-left text-xl font-bold tracking-tight">
                {`${watchedFirstName || ""} ${watchedLastName || ""}`.trim() ||
                  "Your Name"}
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
              disabled={isDisabled}
              className="h-10 text-sm rounded-xl"
            />
            <FormInput
              variant="outline"
              name="last_name"
              label="Last Name"
              placeholder="Your Last Name"
              disabled={isDisabled}
              className="h-10 text-sm rounded-xl"
            />
            <FormPhoneInput
              name="phoneNumber"
              label="Phone Number"
              placeholder="Your Phone Number"
              disabled={isDisabled}
              className="h-10 text-sm rounded-xl"
            />
            <FormDateInput
              variant="outline"
              name="dob"
              label="Date of Birth"
              placeholder="dd/mm/yyyy"
              disabled={isDisabled}
              className="h-10 text-sm rounded-xl"
            />
          </div>

          <FormSelect
            name="gender"
            label="Gender"
            disabled={isDisabled}
            options={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Other", value: "Other" },
            ]}
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
                  onClick={enableEdit}
                  variant="primary"
                  size="lg"
                  className="rounded-2xl px-12 shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                  disabled={loading}
                >
                  <Pencil className="w-4 h-4" />
                  Edit Profile
                </Button>
              </>
            )}
          </AnimationItem>
        </div>

        {/* Form Actions Section */}
      </div>
    </AppForm>
  );
};
