import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/api/auth/auth.module';
import { UploadModule } from 'src/api/upload/upload.module';
import { UpdateAvatarUseCase } from './use-cases/update-avatar.use-case';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';
import { FindAllUsersUseCase } from './use-cases/find-all-users.use-case';
import { FindOneUserUseCase } from './use-cases/find-one-user.use-case';
import { RemoveUserUseCase } from './use-cases/remove-user.use-case';
import { IUsersRepository } from './domain/users.repository.interface';
import { UsersRepository } from './infrastructure/users.repository';

@Module({
  imports: [forwardRef(() => AuthModule), UploadModule],
  controllers: [UsersController],
  providers: [
    UpdateAvatarUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    FindAllUsersUseCase,
    FindOneUserUseCase,
    RemoveUserUseCase,
    {
      provide: IUsersRepository,
      useClass: UsersRepository,
    },
  ],
  exports: [
    UpdateAvatarUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    FindAllUsersUseCase,
    FindOneUserUseCase,
    RemoveUserUseCase,
    IUsersRepository,
  ],
})
export class UsersModule {}
