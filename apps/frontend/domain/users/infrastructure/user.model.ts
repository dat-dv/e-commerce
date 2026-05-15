import { TUser } from "@/domain/auth/types/auth.model";

export interface TUpdateUserProfileInput extends Pick<
  TUser,
  "id" | "first_name" | "last_name" | "password" | "date_of_birth" | "gender"
> {
  avatar?: File;
  phone_number: string;
  phone_code: string;
}
