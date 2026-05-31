import { EGender } from "@ecommerce/shared";

export interface TUpdateUserInput {
  id: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  dateOfBirth?: string;
  gender?: EGender;
  avatar?: File;
  avatarId?: string;
  phoneNumber?: string;
  phoneCode?: string;
}
