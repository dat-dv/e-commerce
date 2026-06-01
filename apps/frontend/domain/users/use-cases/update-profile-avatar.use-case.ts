import { UseCase } from "@/utils/use-case";

import { ApiResponse } from "@/utils/request/request.types";
import { TUser } from "@/domain/auth/types/auth.model";
import { IUsersRepository } from "../interface/users.repository";

export class UpdateProfileAvatarUseCase extends UseCase<
  { avatar: File; userId: string },
  Promise<ApiResponse<TUser>>
> {
  constructor(private repository: IUsersRepository) {
    super();
  }

  async execute({
    avatar,
    userId,
  }: {
    avatar: File;
    userId: string;
  }): Promise<ApiResponse<TUser>> {
    return this.repository.uploadAvatar(avatar, userId);
  }
}
