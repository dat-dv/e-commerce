import { profileSchema } from "@/hooks/profile/profile.schema";
import { UseCase } from "@/utils/use-case";

import { TUser } from "../model/auth.model";
import { IAuthRepository } from "../model/auth.repository";

export class UpdateProfileUseCase extends UseCase<
  Partial<TUser>,
  Promise<TUser>
> {
  constructor(private repository: IAuthRepository) {
    super();
  }

  async execute(user: Partial<TUser>): Promise<TUser> {
    const validated = profileSchema.partial().parse(user);
    return this.repository.updateProfile({ ...user, ...validated });
  }
}
