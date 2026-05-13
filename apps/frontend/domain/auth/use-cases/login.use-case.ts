import { loginSchema } from "@/hooks/auth/use-login/login.schema";
import { UseCase } from "@/utils/use-case";

import { TAuthRequest, TUser } from "../types/auth.model";
import { IAuthRepository } from "../types/auth.repository";
import { ApiResponse } from "@/utils/request/request.types";

export class LoginUseCase extends UseCase<
  TAuthRequest,
  Promise<ApiResponse<TUser>>
> {
  constructor(private repository: IAuthRepository) {
    super();
  }

  async execute(request: TAuthRequest): Promise<ApiResponse<TUser>> {
    const validated = loginSchema.parse(request);
    return this.repository.login(validated);
  }
}
