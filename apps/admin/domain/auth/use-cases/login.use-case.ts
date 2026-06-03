import { signInSchema } from "@/components/organisms/sign-in-view/sign-in-view.schema";
import { type IAdminUser } from "@/domain/user";
import { UseCase } from "@/utils/use-case";

import { type TAdminSignInRequest } from "../types/auth.model";
import { type IAdminAuthRepository } from "../types/auth.repository";

export class AdminLoginUseCase extends UseCase<
  TAdminSignInRequest,
  Promise<IAdminUser>
> {
  constructor(private repository: IAdminAuthRepository) {
    super();
  }

  async execute(request: TAdminSignInRequest): Promise<IAdminUser> {
    const validated = signInSchema.parse(request);
    return this.repository.login(validated);
  }
}
