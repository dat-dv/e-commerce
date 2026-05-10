import { loginSchema } from '@/hooks/auth/use-login/login.schema';
import { UseCase } from '@/utils/use-case';

import { IAuthRequest, IUser } from '../model/auth.model';
import { IAuthRepository } from '../model/auth.repository';

export class LoginUseCase extends UseCase<IAuthRequest, Promise<IUser>> {
  constructor(private repository: IAuthRepository) {
    super();
  }

  async execute(request: IAuthRequest): Promise<IUser> {
    const validated = loginSchema.parse(request);
    return this.repository.login(validated);
  }
}
