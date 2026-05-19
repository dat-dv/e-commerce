import { UseCase } from "@/utils/use-case";
import { IAuthRepository } from "../types/auth.repository";
import { ApiResponse } from "@/utils/request/request.types";
import { getResetPasswordSchema } from "@/components/molecules/reset-password-form/reset-password.schema";
import { dummyTranslator } from "@/utils/i18n";

interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export class ResetPasswordUseCase extends UseCase<
  ResetPasswordRequest,
  Promise<ApiResponse<void>>
> {
  constructor(private repository: IAuthRepository) {
    super();
  }

  async execute(request: ResetPasswordRequest): Promise<ApiResponse<void>> {
    const validated = getResetPasswordSchema(dummyTranslator).parse({
      password: request.password,
      confirmPassword: request.confirmPassword,
    });
    return this.repository.resetPassword({
      token: request.token,
      newPassword: validated.password,
      confirmPassword: validated.confirmPassword,
    });
  }
}
