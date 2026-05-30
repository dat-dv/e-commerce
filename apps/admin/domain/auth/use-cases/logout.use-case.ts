import { type IApiResponse } from "@ecommerce/shared";

import { UseCase } from "@/utils/use-case";

import { type IAdminAuthRepository } from "../types/auth.repository";

export class AdminLogoutUseCase extends UseCase<
  void,
  Promise<IApiResponse<void>>
> {
  constructor(private repository: IAdminAuthRepository) {
    super();
  }

  async execute(): Promise<IApiResponse<void>> {
    return this.repository.logout();
  }
}
