import type { IAdminUser } from "@/domain/user";

export const getAdminUserDisplayName = (user: IAdminUser) =>
  [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;

export const formatAdminDate = (value?: string | Date | null) => {
  if (!value) return "Not specified";

  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getGenderLabel = (gender?: number | null) => {
  if (gender === 0) return "Male";
  if (gender === 1) return "Female";
  if (gender === 2) return "Other";
  return "Not specified";
};
