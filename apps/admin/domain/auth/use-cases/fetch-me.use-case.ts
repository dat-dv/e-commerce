import { type IAdminUser } from "@/domain/user";
import { UseCase } from "@/utils/use-case";

import { type IAdminAuthRepository } from "../types/auth.repository";

export class AdminFetchMeUseCase extends UseCase<void, Promise<IAdminUser>> {
  constructor(private repository: IAdminAuthRepository) {
    super();
  }

  async execute(): Promise<IAdminUser> {
    return this.repository.fetchMe();
  }
}
