import { signInSchema } from "@/components/organisms/sign-in-view/sign-in-view.schema";
import { type IAdminUser } from "@/domain/user";
import { type ApiResponse } from "@/utils/request/api-client.types";
import { UseCase } from "@/utils/use-case";

import { type TAdminSignInRequest } from "../types/auth.model";
import { type IAdminAuthRepository } from "../types/auth.repository";

export class AdminLoginUseCase extends UseCase<
  TAdminSignInRequest,
  Promise<ApiResponse<IAdminUser>>
> {
  constructor(private repository: IAdminAuthRepository) {
    super();
  }

  async execute(
    request: TAdminSignInRequest,
  ): Promise<ApiResponse<IAdminUser>> {
    const validated = signInSchema.parse(request);
    return this.repository.login(validated);
  }
}
