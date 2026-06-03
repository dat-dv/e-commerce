import { EGender } from "@ecommerce/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { TAdminRole } from "@/domain/permission";
import type { IAdminUser, IAdminUserAvatar } from "@/domain/user";

export const userDetailFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().optional(),
  gender: z.nativeEnum(EGender).optional(),
  roleId: z.string().min(1, "Role is required"),
  avatarId: z.string().optional(),
});

export type IUserDetailFormState = z.infer<typeof userDetailFormSchema>;

export const useUserDetailForm = (
  user: IAdminUser | null,
  avatars: IAdminUserAvatar[],
  roles: TAdminRole[],
) => {
  const methods = useForm<IUserDetailFormState>({
    resolver: zodResolver(userDetailFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: undefined,
      roleId: "",
      avatarId: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    methods.reset({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
      gender: user.gender ?? undefined,
      roleId: user.roleId || roles[0]?.id || "",
      avatarId:
        user.avatarId || avatars.find((avatar) => avatar.isCurrent)?.id || "",
    });
  }, [avatars, roles, user, methods]);

  return methods;
};
