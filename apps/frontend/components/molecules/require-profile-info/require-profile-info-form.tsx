"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@ecommerce/ui";
import { AppForm } from "@ecommerce/ui";
import { FormDateInput } from "@ecommerce/ui";
import { FormInput } from "@ecommerce/ui";
import { FormSelect } from "@ecommerce/ui";
import { GENDER_OPTIONS } from "@/constants/gender.constant";
import { TUser } from "@/domain/auth/types/auth.model";
import { EGender } from "@ecommerce/shared";
import {
  getRequireProfileInfoSchema,
  TRequireProfileInfoSchema,
} from "./require-profile-info-form.schema";

export const RequireProfileInfoForm = ({
  onSubmit,
  logout,
  user,
}: {
  onSubmit: (data: TRequireProfileInfoSchema) => void;
  logout: () => void;
  user: Pick<TUser, "firstName" | "lastName" | "dateOfBirth" | "gender">;
}) => {
  const t = useTranslations("RequireProfileInfoModal");
  const tValidation = useTranslations("Validation");

  const requireFields = ["firstName", "lastName", "dateOfBirth", "gender"];
  const show =
    !!user &&
    requireFields.every((field) => {
      const value = user[field as keyof typeof user];
      return value === null || value === undefined || value === "";
    });

  const schema = useMemo(
    () => getRequireProfileInfoSchema(tValidation),
    [tValidation],
  );

  const methods = useForm<TRequireProfileInfoSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      dateOfBirth: user?.dateOfBirth ? String(user.dateOfBirth) : "2000-01-01",
      gender: user?.gender ?? undefined,
    },
  });

  useEffect(() => {
    if (show) {
      methods.reset({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        dateOfBirth: user?.dateOfBirth
          ? String(user.dateOfBirth)
          : "2000-01-01",
        gender: user?.gender ?? undefined,
      });
    }
  }, [user, methods, show]);

  const translatedGenderOptions = useMemo(() => {
    const EGenderMap: Record<EGender, "male" | "female" | "other"> = {
      [EGender.MALE]: "male", // EGender.MALE
      [EGender.FEMALE]: "female", // EGender.FEMALE
      [EGender.OTHER]: "other", // EGender.OTHER
    };

    const genderLabels = {
      male: t("form.genders.male"),
      female: t("form.genders.female"),
      other: t("form.genders.other"),
    };

    return GENDER_OPTIONS.map((opt) => {
      const key = EGenderMap[opt.value];
      return {
        ...opt,
        label: genderLabels[key],
      };
    });
  }, [t]);

  return (
    <AppForm methods={methods} onSubmit={onSubmit}>
      <div className="space-y-4">
        <FormInput
          name="firstName"
          label={t("form.firstNameLabel")}
          placeholder={t("form.firstNamePlaceholder")}
          variant="underline"
        />
        <FormInput
          name="lastName"
          label={t("form.lastNameLabel")}
          placeholder={t("form.lastNamePlaceholder")}
          variant="underline"
        />
        <FormDateInput
          name="dateOfBirth"
          label={t("form.dateOfBirthLabel")}
          placeholder={t("form.dateOfBirthPlaceholder")}
          variant="underline"
          maxDate={new Date()}
        />
        <FormSelect
          name="gender"
          label={t("form.genderLabel")}
          variant="underline"
          options={translatedGenderOptions}
        />
      </div>

      <div className="mt-4 flex justify-end gap-4">
        <Button
          type="submit"
          variant="primary"
          className="mt-6 w-fit"
          size="lg"
        >
          {t("form.submit")}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="mt-6 w-fit"
          size="lg"
          onClick={logout}
        >
          {t("form.logout")}
        </Button>
      </div>
    </AppForm>
  );
};
