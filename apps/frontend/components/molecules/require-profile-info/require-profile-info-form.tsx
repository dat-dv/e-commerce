"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import Button from "@/components/atoms/button";
import { FormInput } from "@/components/molecules/form/form-input";
import { FormDateInput } from "@/components/molecules/form/form-date-input";
import { FormSelect } from "@/components/molecules/form/form-select";
import AppForm from "@/components/molecules/form/app-form";
import { TUser } from "@/domain/auth/types/auth.model";
import {
  requireProfileInfoSchema,
  TRequireProfileInfoSchema,
} from "./require-profile-info-form.schema";
import { GENDER_OPTIONS } from "@/constants/gender.constant";

export const RequireProfileInfoForm = ({
  onSubmit,
  logout,
  user,
}: {
  onSubmit: (data: TRequireProfileInfoSchema) => void;
  logout: () => void;
  user: Pick<TUser, "firstName" | "lastName" | "dateOfBirth" | "gender">;
}) => {
  const requireFields = ["firstName", "lastName", "dateOfBirth", "gender"];
  const show =
    !!user &&
    requireFields.every((field) => {
      const value = user[field as keyof typeof user];
      return value === null || value === undefined || value === "";
    });

  const methods = useForm<TRequireProfileInfoSchema>({
    resolver: zodResolver(requireProfileInfoSchema),
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

  return (
    <AppForm methods={methods} onSubmit={onSubmit}>
      <div className="space-y-4">
        <FormInput
          name="firstName"
          label="First Name"
          placeholder="Enter first name"
          variant="underline"
        />
        <FormInput
          name="lastName"
          label="Last Name"
          placeholder="Enter last name"
          variant="underline"
        />
        <FormDateInput
          name="dateOfBirth"
          label="Date of Birth"
          placeholder="dd/mm/yyyy"
          variant="underline"
          maxDate={new Date()}
        />
        <FormSelect
          name="gender"
          label="Gender"
          variant="underline"
          options={GENDER_OPTIONS}
        />
      </div>

      <div className="flex gap-4 justify-end mt-4">
        <Button
          type="submit"
          variant="primary"
          className="w-fit mt-6"
          size="lg"
        >
          Save & Continue
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-fit mt-6"
          size="lg"
          onClick={logout}
        >
          Logout
        </Button>
      </div>
    </AppForm>
  );
};
