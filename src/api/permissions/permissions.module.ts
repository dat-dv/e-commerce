import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { AuthModule } from '../auth/auth.module';
import { IPermissionsRepository } from './domain/entities/permissions.repository.interface';
import { PermissionsRepository } from './domain/infrastructure/permissions.repository';
import { CreatePermissionUseCase } from './domain/use-cases/create-permission.use-case';
import { FindAllPermissionsUseCase } from './domain/use-cases/find-all-permissions.use-case';
import { FindOnePermissionUseCase } from './domain/use-cases/find-one-permission.use-case';
import { UpdatePermissionUseCase } from './domain/use-cases/update-permission.use-case';
import { RemovePermissionUseCase } from './domain/use-cases/remove-permission.use-case';

@Module({
  imports: [AuthModule],
  controllers: [PermissionsController],
  providers: [
    CreatePermissionUseCase,
    FindAllPermissionsUseCase,
    FindOnePermissionUseCase,
    UpdatePermissionUseCase,
    RemovePermissionUseCase,
    {
      provide: IPermissionsRepository,
      useClass: PermissionsRepository,
    },
  ],
  exports: [IPermissionsRepository],
})
export class PermissionsModule {}
