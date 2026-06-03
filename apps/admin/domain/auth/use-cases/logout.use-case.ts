import { UseCase } from "@/utils/use-case";

import { type IAdminAuthRepository } from "../types/auth.repository";

export class AdminLogoutUseCase extends UseCase<void, Promise<void>> {
  constructor(private repository: IAdminAuthRepository) {
    super();
  }

  async execute(): Promise<void> {
    return this.repository.logout();
  }
}
