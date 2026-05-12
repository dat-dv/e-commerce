import { Injectable, Inject } from '@nestjs/common';
import { IAddressesRepository } from '../entities/addresses.repository.interface';

@Injectable()
export class GetAddressesUseCase {
  constructor(
    @Inject(IAddressesRepository)
    private readonly addressesRepository: IAddressesRepository,
  ) {}

  async execute(userId: string) {
    return this.addressesRepository.findAll(userId);
  }
}
