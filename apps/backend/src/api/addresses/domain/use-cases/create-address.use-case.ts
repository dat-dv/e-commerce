import { Injectable, Inject } from '@nestjs/common';
import { IAddressesRepository } from '../entities/addresses.repository.interface';
import { CreateAddressDto } from '../../dto/create-address.dto';

@Injectable()
export class CreateAddressUseCase {
  constructor(
    @Inject(IAddressesRepository)
    private readonly addressesRepository: IAddressesRepository,
  ) {}

  async execute(userId: string, dto: CreateAddressDto) {
    const address = await this.addressesRepository.create(userId, dto);

    if (dto.is_default) {
      await this.addressesRepository.unsetOthersDefault(userId, address.id);
    }

    return address;
  }
}
