import { UseCase } from "@/utils/use-case";

import { IAuthRepository } from "../types/auth.repository";
import { ApiResponse } from "@/utils/request/request.types";

export class LogoutUseCase extends UseCase<void, Promise<ApiResponse<void>>> {
  constructor(private repository: IAuthRepository) {
    super();
  }

  async execute(): Promise<ApiResponse<void>> {
    return this.repository.logout();
  }
}
