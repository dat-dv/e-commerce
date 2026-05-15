import { UseCase } from "@/utils/use-case";

import { TUser } from "../../auth/types/auth.model";
import { ApiResponse } from "@/utils/request/request.types";
import { IUsersRepository } from "../interface/users.repository";

export class UpdateProfileUseCase extends UseCase<
  Partial<TUser>,
  Promise<ApiResponse<TUser>>
> {
  constructor(private repository: IUsersRepository) {
    super();
  }

  async execute(user: Partial<TUser>): Promise<ApiResponse<TUser>> {
    return this.repository.updateProfile(user);
  }
}
