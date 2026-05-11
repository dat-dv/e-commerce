import { EGender } from "@/domain/auth/types/auth.model";

export const GENDER_OPTIONS: { label: string; value: EGender }[] = [
  { label: "Male", value: EGender.MALE },
  { label: "Female", value: EGender.FEMALE },
  { label: "Other", value: EGender.OTHER },
];
