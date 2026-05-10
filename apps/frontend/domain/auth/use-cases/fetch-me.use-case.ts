import { UseCase } from "@/utils/use-case";

import { TUser } from "../model/auth.model";
import { IAuthRepository } from "../model/auth.repository";

export class FetchMeUseCase extends UseCase<void, Promise<TUser>> {
  constructor(private repository: IAuthRepository) {
    super();
  }

  async execute(): Promise<TUser> {
    return this.repository.fetchMe();
  }
}
