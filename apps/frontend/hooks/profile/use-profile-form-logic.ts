"use client";

import { TUser } from "@/domain/auth/types/auth.model";
import { TUpdateUserInput } from "@/domain/users/types/user.model";
import {
  getProfileSchema,
  ProfileSchema,
} from "@/hooks/profile/profile.schema";
import { EGender } from "@ecommerce/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface UseProfileFormLogicProps {
  user: Partial<TUser> | null;
  isLoading?: boolean;
  updateProfile: (user: TUpdateUserInput) => Promise<boolean | void>;
}

export function useProfileFormLogic({
  user,
  isLoading,
  updateProfile,
}: UseProfileFormLogicProps) {
  const t = useTranslations("ProfilePage");
  const tValidation = useTranslations("Validation");
  const [isEditing, setIsEditing] = useState(false);

  const avatarRef = useRef(user?.avatarId);
  const schema = useMemo(() => getProfileSchema(tValidation), [tValidation]);

  const methods = useForm<ProfileSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      dateOfBirth: String(user?.dateOfBirth || ""),
      avatarUrl: user?.avatarUrl || "",
      phone: {
        phoneCode: user?.phones?.[0]?.phoneCode?.slice(0, 3) || "",
        phoneNumber: user?.phones?.[0]?.phoneNumber || "",
      },
      email: user?.email || "",
      avatarId: user?.avatarId || "",
      gender: user?.gender === null ? undefined : user?.gender,
    },
  });

  const translatedGenderOptions = useMemo(
    () => [
      { label: t("form.genders.male"), value: EGender.MALE },
      { label: t("form.genders.female"), value: EGender.FEMALE },
      { label: t("form.genders.other"), value: EGender.OTHER },
    ],
    [t],
  );

  useEffect(() => {
    if (user && !isEditing) {
      methods.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dateOfBirth: String(user.dateOfBirth || ""),
        avatarUrl: user?.avatarUrl || "",
        phone: {
          phoneCode: user?.phones?.[0]?.phoneCode?.slice(0, 3) || "",
          phoneNumber: user?.phones?.[0]?.phoneNumber || "",
        },
        email: user.email || "",
        avatarId: user.avatarId || "",
        gender: user.gender === null ? undefined : user.gender,
      });
    }
  }, [user, methods, isEditing]);

  const enableEdit = () => setIsEditing(true);

  const disableEdit = () => {
    if (user) {
      avatarRef.current = user.avatarId;
      methods.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dateOfBirth: String(user.dateOfBirth || ""),
        avatarUrl: user?.avatarUrl || "",
        phone: {
          phoneCode: user?.phones?.[0]?.phoneCode?.slice(0, 3) || "",
          phoneNumber: user?.phones?.[0]?.phoneNumber || "",
        },
        email: user.email || "",
        avatarId: user.avatarId || "",
        gender: user.gender === null ? undefined : user.gender,
      });
    }
    setIsEditing(false);
  };

  const handleSave = async (data: ProfileSchema) => {
    const finalAvatarUrl = data.avatarUrl;

    let file: File | undefined;
    if (finalAvatarUrl && finalAvatarUrl.startsWith("data:image")) {
      const response = await fetch(finalAvatarUrl);
      const blob = await response.blob();
      file = new File([blob], "avatar.jpg", { type: blob.type });
      console.log("file", file);
    }

    const success = await updateProfile({
      id: user?.id || "",
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth || "",
      phoneNumber: data.phone?.phoneNumber || "",
      gender: data.gender ?? undefined,
      phoneCode: data.phone?.phoneCode || "",
      avatarId: data.avatarId || undefined,
      ...(file ? { avatar: file } : {}),
    });

    if (success) {
      setIsEditing(false);
    }
  };

  const isFormDisabled = isLoading || !isEditing;
  const isSubmitLoading = isLoading;

  return {
    t,
    methods,
    isEditing,
    isFormDisabled,
    isSubmitLoading,
    translatedGenderOptions,
    enableEdit,
    disableEdit,
    handleSave,
  };
}
