import { UseCase } from "@/utils/use-case";
import { IAuthRepository } from "../types/auth.repository";
import { ApiResponse } from "@/utils/request/request.types";

export class ChangePasswordUseCase extends UseCase<
  { oldPassword: string; newPassword: string; confirmPassword: string },
  Promise<ApiResponse<{ success: boolean }>>
> {
  constructor(private repository: IAuthRepository) {
    super();
  }

  async execute(request: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<{ success: boolean }>> {
    return this.repository.changePassword(request);
  }
}
