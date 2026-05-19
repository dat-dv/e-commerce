import { UseCase } from "@/utils/use-case";
import { IAuthRepository } from "../types/auth.repository";
import { ApiResponse } from "@/utils/request/request.types";
import { getForgotPasswordSchema } from "@/components/molecules/forgot-password-form/forgot-password.schema";

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
    const validated = getForgotPasswordSchema((k) => k).parse(request);
    return this.repository.forgotPassword(validated);
  }
}
