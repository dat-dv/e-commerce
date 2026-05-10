import { profileSchema } from '@/hooks/profile/profile.schema';
import { UseCase } from '@/utils/use-case';

import { IUser } from '../model/auth.model';
import { IAuthRepository } from '../model/auth.repository';

export class UpdateProfileUseCase extends UseCase<Partial<IUser>, Promise<IUser>> {
  constructor(private repository: IAuthRepository) {
    super();
  }

  async execute(user: Partial<IUser>): Promise<IUser> {
    const validated = profileSchema.partial().parse(user);
    return this.repository.updateProfile({ ...user, ...validated });
  }
}
