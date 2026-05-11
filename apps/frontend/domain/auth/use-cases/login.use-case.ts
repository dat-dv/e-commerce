import { loginSchema } from "@/hooks/auth/use-login/login.schema";
import { UseCase } from "@/utils/use-case";

import { IAuthRequest, TUser } from "../types/auth.model";
import { IAuthRepository } from "../types/auth.repository";
import { ApiResponse } from "@/utils/request/request.types";

export class LoginUseCase extends UseCase<
  IAuthRequest,
  Promise<ApiResponse<TUser>>
> {
  constructor(private repository: IAuthRepository) {
    super();
  }

  async execute(request: IAuthRequest): Promise<ApiResponse<TUser>> {
    const validated = loginSchema.parse(request);
    return this.repository.login(validated);
  }
}
