import { forgotPasswordSchema } from "@/components/organisms/forgot-password-view/forgot-password-view.schema";
import { type ApiResponse } from "@/utils/request/api-client.types";
import { UseCase } from "@/utils/use-case";

import { type TAdminForgotPasswordRequest } from "../types/auth.model";
import { type IAdminAuthRepository } from "../types/auth.repository";

export class AdminForgotPasswordUseCase extends UseCase<
  TAdminForgotPasswordRequest,
  Promise<ApiResponse<void>>
> {
  constructor(private repository: IAdminAuthRepository) {
    super();
  }

  async execute(
    request: TAdminForgotPasswordRequest,
  ): Promise<ApiResponse<void>> {
    const validated = forgotPasswordSchema.parse(request);
    return this.repository.forgotPassword(validated);
  }
}
