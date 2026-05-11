import { UseCase } from "@/utils/use-case";
import { IAuthRepository } from "../types/auth.repository";
import { ApiResponse } from "@/utils/request/request.types";

export class VerifyPhoneUseCase extends UseCase<
  { token: string; phone: string; phone_code: string },
  Promise<ApiResponse<{ success: boolean }>>
> {
  constructor(private repository: IAuthRepository) {
    super();
  }

  async execute(request: {
    token: string;
    phone: string;
    phone_code: string;
  }): Promise<ApiResponse<{ success: boolean }>> {
    return this.repository.verifyPhone(request);
  }
}
