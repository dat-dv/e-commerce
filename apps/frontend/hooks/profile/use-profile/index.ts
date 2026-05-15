"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { authUseCase } from "@/domain/auth/use-cases";
import { useAuthStore } from "@/hooks/auth/use-auth-store";

import { ProfileSchema, profileSchema } from "../profile.schema";

export const useProfile = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const loading = useAuthStore((state) => state.loading);
  const [isEditing, setIsEditing] = useState(false);

  const avatarRef = useRef(user?.avatar_id);

  const methods = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      dob: String(user?.date_of_birth || ""),
      avatarUrl: user?.avatar_url || "",
      phoneNumber: user?.phone_number || "",
      gender: user?.gender ?? undefined,
    },
  });

  useEffect(() => {
    if (user) {
      methods.reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        dob: String(user.date_of_birth || ""),
        avatarUrl: user?.avatar_url || "",
        phoneNumber: user.phone_number || "",
        gender: user.gender ?? undefined,
      });
    }
  }, [user, methods]);

  const handleSave = async (data: ProfileSchema) => {
    avatarRef.current = data.avatarUrl;
    setLoading(true);

    try {
      const response = await authUseCase.updateProfile.execute({
        id: user?.id,
        date_of_birth: data.dob,
        last_name: data.last_name,
        first_name: data.first_name,
        avatar_url: data.avatarUrl,
        phone_number: data.phoneNumber,
        gender: data.gender,
      });

      if (response.status === "success" && response.data) {
        setUser(response.data);
        toast.success("Profile updated successfully!");
      } else {
        throw new Error(response.message || "Update failed");
      }
      setIsEditing(false);
    } catch (err: unknown) {
      toast.error((err as Error).message || "Update failed", {
        toastId: "profile-error",
      });
    } finally {
      setLoading(false);
    }
  };

  const enableEdit = () => {
    setIsEditing(true);
  };

  const disableEdit = () => {
    if (user) {
      avatarRef.current = user.avatar_id;
      methods.reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        dob: String(user.date_of_birth || ""),
        avatarUrl: user?.avatar_url || "",
        phoneNumber: user.phone_number || "",
        gender: user.gender ?? undefined,
      });
    }
    setIsEditing(false);
  };

  return {
    user,
    handleSave,
    methods,
    loading,
    isEditing,
    enableEdit,
    disableEdit,
  };
};

export default useProfile;
