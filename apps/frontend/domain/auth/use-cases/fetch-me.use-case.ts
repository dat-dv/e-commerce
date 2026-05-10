import { UseCase } from "@/utils/use-case";

import { TUser } from "../types/auth.model";
import { IAuthRepository } from "../types/auth.repository";
import { ApiResponse } from "@/utils/request/request.types";

export class FetchMeUseCase extends UseCase<void, Promise<ApiResponse<TUser>>> {
  constructor(private repository: IAuthRepository) {
    super();
  }

  async execute(): Promise<ApiResponse<TUser>> {
    return this.repository.fetchMe();
  }
}
