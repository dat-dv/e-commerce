"use client";

import React from "react";
import { useChangePassword } from "@/hooks/profile/use-change-password";
import { ChangePasswordForm } from "@/components/molecules/change-password-form";

export const PasswordView = () => {
  const { changePassword, loading } = useChangePassword();

  return (
    <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-content">Change Password</h1>
        <p className="text-sm text-content/60">
          Update your password to keep your account secure.
        </p>
      </div>

      <ChangePasswordForm onSubmit={changePassword} loading={loading} />
    </div>
  );
};
