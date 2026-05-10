export interface IUserResponse {
  id: string;
  full_name: string;
  email_address: string;
  profile_picture: string | null;
  date_of_birth: string | null;
  address: string | null;
  password?: string;
}
