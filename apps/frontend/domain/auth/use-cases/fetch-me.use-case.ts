import { UseCase } from "@/utils/use-case";

import { IUser } from "../model/auth.model";
import { IAuthRepository } from "../model/auth.repository";

export class FetchMeUseCase extends UseCase<void, Promise<IUser>> {
  constructor(private repository: IAuthRepository) {
    super();
  }

  async execute(): Promise<IUser> {
    return this.repository.fetchMe();
  }
}
