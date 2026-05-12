import { forwardRef, Module } from '@nestjs/common';
import { AddressesController } from './addresses.controller';
import { CreateAddressUseCase } from './domain/use-cases/create-address.use-case';
import { GetAddressesUseCase } from './domain/use-cases/get-addresses.use-case';
import { UpdateAddressUseCase } from './domain/use-cases/update-address.use-case';
import { DeleteAddressUseCase } from './domain/use-cases/delete-address.use-case';
import { IAddressesRepository } from './domain/entities/addresses.repository.interface';
import { AddressesRepository } from './domain/infrastructure/addresses.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [AddressesController],
  imports: [forwardRef(() => AuthModule)],
  providers: [
    CreateAddressUseCase,
    GetAddressesUseCase,
    UpdateAddressUseCase,
    DeleteAddressUseCase,
    {
      provide: IAddressesRepository,
      useClass: AddressesRepository,
    },
  ],
  exports: [IAddressesRepository],
})
export class AddressesModule {}
