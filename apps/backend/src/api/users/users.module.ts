import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/api/auth/auth.module';
import { UploadModule } from 'src/api/upload/upload.module';
import { UpdateAvatarUseCase } from './domain/use-cases/update-avatar.use-case';
import { CreateUserUseCase } from './domain/use-cases/create-user.use-case';
import { UpdateUserUseCase } from './domain/use-cases/update-user.use-case';
import { FindAllUsersUseCase } from './domain/use-cases/find-all-users.use-case';
import { FindOneUserUseCase } from './domain/use-cases/find-one-user.use-case';
import { RemoveUserUseCase } from './domain/use-cases/remove-user.use-case';
import { IUsersRepository } from './domain/entities/users.repository.interface';
import { UsersRepository } from './domain/infrastructure/users.repository';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';

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
