import { TUser } from "../model/auth.model";
import { IUserResponse } from "./auth.response";

export const UserMapper = {
  toDomain(dto: IUserResponse): TUser {
    return {
      id: dto.id,
      name: dto.full_name,
      email: dto.email_address,
      dob: dto.date_of_birth,
      address: dto.address,
      avatarUrl: dto.profile_picture,
    };
  },
  toDTO(user: Partial<TUser>): Partial<IUserResponse> {
    const dto: Partial<IUserResponse> = {};
    if (user.id) dto.id = user.id;
    if (user.name) dto.full_name = user.name;
    if (user.email) dto.email_address = user.email;
    if (user.dob !== undefined) dto.date_of_birth = user.dob;
    if (user.address !== undefined) dto.address = user.address;
    if (user.avatarUrl !== undefined) dto.profile_picture = user.avatarUrl;
    if (user.password) dto.password = user.password;
    return dto;
  },
};
