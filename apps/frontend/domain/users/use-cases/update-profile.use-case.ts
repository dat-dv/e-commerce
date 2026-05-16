import { UseCase } from "@/utils/use-case";

import { TUser } from "../../auth/types/auth.model";
import { ApiResponse } from "@/utils/request/request.types";
import { IUsersRepository } from "../interface/users.repository";
import { TUpdateUserInput } from "../types/user.model";

export class UpdateProfileUseCase extends UseCase<
  TUpdateUserInput,
  Promise<ApiResponse<TUser>>
> {
  constructor(private repository: IUsersRepository) {
    super();
  }

  async execute(user: TUpdateUserInput): Promise<ApiResponse<TUser>> {
    return this.repository.updateProfile(user);
  }
}
