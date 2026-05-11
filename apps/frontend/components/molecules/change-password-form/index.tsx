"use client";

import { Lock } from "lucide-react";
import { FormInput } from "@/components/molecules/form/form-input";
import AppForm from "@/components/molecules/form/app-form";
import Button from "@/components/atoms/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "./change-password.schema";

interface ChangePasswordFormProps {
  onSubmit: (data: ChangePasswordFormData) => Promise<boolean>;
  loading: boolean;
}

export const ChangePasswordForm = ({
  onSubmit,
  loading,
}: ChangePasswordFormProps) => {
  const methods = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleFormSubmit = async (data: ChangePasswordFormData) => {
    const success = await onSubmit(data);
    if (success) {
      methods.reset();
    }
  };

  return (
    <AppForm methods={methods} onSubmit={handleFormSubmit}>
      <div className="space-y-4 max-w-md">
        <FormInput
          name="currentPassword"
          label="Current Password"
          type="password"
          placeholder="••••••••"
          variant="outline"
          className="h-10 text-sm rounded-xl"
          disabled={loading}
        />

        <FormInput
          name="newPassword"
          label="New Password"
          type="password"
          placeholder="••••••••"
          variant="outline"
          className="h-10 text-sm rounded-xl"
          disabled={loading}
        />

        <FormInput
          name="confirmPassword"
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          variant="outline"
          className="h-10 text-sm rounded-xl"
          disabled={loading}
        />

        <Button
          type="submit"
          loading={loading}
          className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors w-full mt-6"
        >
          <Lock size={18} />
          Update Password
        </Button>
      </div>
    </AppForm>
  );
};
