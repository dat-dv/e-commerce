import { UseCase } from "@/utils/use-case";
import { IAuthRepository } from "../types/auth.repository";
import { ApiResponse } from "@/utils/request/request.types";
import { forgotPasswordSchema } from "@/components/molecules/forgot-password-form/forgot-password.schema";

export class ForgotPasswordUseCase extends UseCase<
  { email?: string; phone?: string },
  Promise<ApiResponse<void>>
> {
  constructor(private repository: IAuthRepository) {
    super();
  }

  async execute(request: {
    email?: string;
    phone?: string;
  }): Promise<ApiResponse<void>> {
    const validated = forgotPasswordSchema.parse(request);
    return this.repository.forgotPassword(validated);
  }
}
