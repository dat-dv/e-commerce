import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IAddressesRepository } from '../entities/addresses.repository.interface';
import { UpdateAddressDto } from '../../dto/update-address.dto';

@Injectable()
export class UpdateAddressUseCase {
  constructor(
    @Inject(IAddressesRepository)
    private readonly addressesRepository: IAddressesRepository,
  ) {}

  async execute(id: string, userId: string, dto: UpdateAddressDto) {
    const address = await this.addressesRepository.findById(id);

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.user_id !== userId) {
      throw new ForbiddenException('You do not have permission to update this address');
    }

    const updatedAddress = await this.addressesRepository.update(id, dto);

    if (dto.is_default) {
      await this.addressesRepository.unsetOthersDefault(userId, id);
    }

    return updatedAddress;
  }
}
