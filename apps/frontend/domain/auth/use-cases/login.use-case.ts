import { loginSchema } from "@/hooks/auth/use-login/login.schema";
import { UseCase } from "@/utils/use-case";

import { IAuthRequest, TUser } from "../types/auth.model";
import { IAuthRepository } from "../types/auth.repository";

export class LoginUseCase extends UseCase<IAuthRequest, Promise<TUser>> {
  constructor(private repository: IAuthRepository) {
    super();
  }

  async execute(request: IAuthRequest): Promise<TUser> {
    const validated = loginSchema.parse(request);
    return this.repository.login(validated);
  }
}
