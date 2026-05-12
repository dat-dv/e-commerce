import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IAddressesRepository } from '../entities/addresses.repository.interface';

@Injectable()
export class DeleteAddressUseCase {
  constructor(
    @Inject(IAddressesRepository)
    private readonly addressesRepository: IAddressesRepository,
  ) {}

  async execute(id: string, userId: string) {
    const address = await this.addressesRepository.findById(id);

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.user_id !== userId) {
      throw new ForbiddenException('You do not have permission to delete this address');
    }

    await this.addressesRepository.delete(id);
  }
}
