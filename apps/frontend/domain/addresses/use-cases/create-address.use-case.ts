import { ICreateAddressInput } from "../types/address.model";
import { IAddressesRepository } from "../infrastructure/addresses.repository";

export class CreateAddressUseCase {
  constructor(private addressesRepository: IAddressesRepository) {}

  async execute(data: ICreateAddressInput) {
    return this.addressesRepository.createAddress(data);
  }
}
