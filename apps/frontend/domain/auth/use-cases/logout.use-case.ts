import { UseCase } from "@/utils/use-case";

import { IAuthRepository } from "../model/auth.repository";

export class LogoutUseCase extends UseCase<void, Promise<void>> {
  constructor(private repository: IAuthRepository) {
    super();
  }

  async execute(): Promise<void> {
    return this.repository.logout();
  }
}
