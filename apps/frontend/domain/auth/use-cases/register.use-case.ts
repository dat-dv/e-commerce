import { registerSchema } from "@/hooks/auth/use-register/register.schema";
import { UseCase } from "@/utils/use-case";

import { IRegisterRequest } from "../model/auth.model";
import { IAuthRepository } from "../model/auth.repository";

export class RegisterUseCase extends UseCase<IRegisterRequest, Promise<void>> {
  constructor(private repository: IAuthRepository) {
    super();
  }

  async execute(request: IRegisterRequest): Promise<void> {
    const validated = registerSchema.parse(request);
    return this.repository.register(validated);
  }
}
