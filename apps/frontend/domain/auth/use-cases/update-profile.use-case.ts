import { UseCase } from "@/utils/use-case";

import { TUser } from "../types/auth.model";
import { IAuthRepository } from "../types/auth.repository";
import { ApiResponse } from "@/utils/request/request.types";

export class UpdateProfileUseCase extends UseCase<
  Partial<TUser>,
  Promise<ApiResponse<TUser>>
> {
  constructor(private repository: IAuthRepository) {
    super();
  }

  async execute(user: Partial<TUser>): Promise<ApiResponse<TUser>> {
    return this.repository.updateProfile(user);
  }
}
