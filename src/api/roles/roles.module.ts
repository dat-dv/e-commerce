import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { AuthModule } from '../auth/auth.module';
import { IRolesRepository } from './domain/entities/roles.repository.interface';
import { RolesRepository } from './domain/infrastructure/roles.repository';
import { CreateRoleUseCase } from './domain/use-cases/create-role.use-case';
import { FindAllRolesUseCase } from './domain/use-cases/find-all-roles.use-case';
import { FindOneRoleUseCase } from './domain/use-cases/find-one-role.use-case';
import { UpdateRoleUseCase } from './domain/use-cases/update-role.use-case';
import { RemoveRoleUseCase } from './domain/use-cases/remove-role.use-case';

@Module({
  imports: [AuthModule],
  controllers: [RolesController],
  providers: [
    CreateRoleUseCase,
    FindAllRolesUseCase,
    FindOneRoleUseCase,
    UpdateRoleUseCase,
    RemoveRoleUseCase,
    {
      provide: IRolesRepository,
      useClass: RolesRepository,
    },
  ],
  exports: [IRolesRepository],
})
export class RolesModule {}
