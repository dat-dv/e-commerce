import { registerSchema } from "@/hooks/auth/use-register/register.schema";
import { UseCase } from "@/utils/use-case";

import { TRegisterRequest } from "../types/auth.model";
import { IAuthRepository } from "../types/auth.repository";
import { ApiResponse } from "@/utils/request/request.types";

export class RegisterUseCase extends UseCase<
  TRegisterRequest,
  Promise<ApiResponse<null>>
> {
  constructor(private repository: IAuthRepository) {
    super();
  }

  async execute(request: TRegisterRequest): Promise<ApiResponse<null>> {
    const validated = registerSchema.parse(request);
    return this.repository.register(validated);
  }
}
