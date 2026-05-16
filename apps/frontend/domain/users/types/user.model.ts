import { EGender } from "@ecommerce/shared";

export interface TUpdateUserInput {
  id: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  dateOfBirth?: string;
  gender?: EGender;
  avatar?: File;
  phoneNumber?: string;
  phoneCode?: string;
}
