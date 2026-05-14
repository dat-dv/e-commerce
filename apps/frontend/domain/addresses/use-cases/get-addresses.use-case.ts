import { IAddressesRepository } from "../infrastructure/addresses.repository";

export class GetAddressesUseCase {
  constructor(private repository: IAddressesRepository) {}
  async execute() {
    return this.repository.getAddresses();
  }
}

export class GetDefaultAddressUseCase {
  constructor(private repository: IAddressesRepository) {}
  async execute() {
    return this.repository.getDefaultAddress();
  }
}
