import { type IApiResponse } from "@ecommerce/shared";

import { type IAdminUser } from "@/domain/user";
import { UseCase } from "@/utils/use-case";

import { type IAdminAuthRepository } from "../types/auth.repository";

export class AdminFetchMeUseCase extends UseCase<
  void,
  Promise<IApiResponse<IAdminUser>>
> {
  constructor(private repository: IAdminAuthRepository) {
    super();
  }

  async execute(): Promise<IApiResponse<IAdminUser>> {
    return this.repository.fetchMe();
  }
}
