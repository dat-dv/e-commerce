"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { RequireProfileInfoForm } from "./require-profile-info-form";
import { TRequireProfileInfoSchema } from "./require-profile-info-form.schema";
import { authUseCase } from "@/domain/auth/use-cases";

const RequireProfileInfoModal = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const show =
    user && (!user.first_name || !user.last_name || !user.date_of_birth);

  const onSubmit = async (data: TRequireProfileInfoSchema) => {
    try {
      const updatedUser = await authUseCase.updateProfile.execute({
        first_name: data.first_name,
        last_name: data.last_name,
        date_of_birth: data.dob,
        id: user?.id,
      });

      setUser({
        ...user,
        ...updatedUser,
      });
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  if (!show) return null;

  return (
    <Dialog open onClose={() => {}} className="relative z-[100]">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 min-w-[420px]">
        {/* Full-screen container to center the panel */}
        <DialogPanel className="w-full max-w-xl bg-surface rounded-3xl p-8 animate-in zoom-in-95">
          <DialogTitle className="text-2xl font-bold mb-2">
            Complete Your Profile
          </DialogTitle>
          <p className="text-content/60 mb-6">
            Please provide the missing information to continue.
          </p>
          <RequireProfileInfoForm
            onSubmit={onSubmit}
            logout={logout}
            user={user}
          />
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default RequireProfileInfoModal;
