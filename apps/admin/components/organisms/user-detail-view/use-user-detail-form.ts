import { useEffect, useState } from "react";

import type { TAdminRole } from "@/domain/permission";
import type { IAdminUser, IAdminUserAvatar } from "@/domain/user";

export interface IUserDetailFormState {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  roleId: string;
  avatarId: string;
}

export const useUserDetailForm = (
  user: IAdminUser | null,
  avatars: IAdminUserAvatar[],
  roles: TAdminRole[],
  setSuccessMessage: (msg: string | null) => void,
) => {
  const [form, setForm] = useState<IUserDetailFormState>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    roleId: "",
    avatarId: "",
  });

  useEffect(() => {
    if (!user) return;

    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
      gender:
        user.gender === null || user.gender === undefined
          ? ""
          : String(user.gender),
      roleId: user.roleId || roles[0]?.id || "",
      avatarId:
        user.avatarId || avatars.find((avatar) => avatar.isCurrent)?.id || "",
    });
  }, [avatars, roles, user]);

  const updateForm = <TField extends keyof IUserDetailFormState>(
    field: TField,
    value: IUserDetailFormState[TField],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSuccessMessage(null);
  };

  return {
    form,
    updateForm,
  };
};
