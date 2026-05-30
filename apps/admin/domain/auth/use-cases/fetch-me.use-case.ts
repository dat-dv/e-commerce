import { type IAdminUser } from "@/domain/user";
import { type ApiResponse } from "@/utils/request/api-client.types";
import { UseCase } from "@/utils/use-case";

import { type IAdminAuthRepository } from "../types/auth.repository";

export class AdminFetchMeUseCase extends UseCase<
  void,
  Promise<ApiResponse<IAdminUser>>
> {
  constructor(private repository: IAdminAuthRepository) {
    super();
  }

  async execute(): Promise<ApiResponse<IAdminUser>> {
    return this.repository.fetchMe();
  }
}
