import { IAddressesRepository } from "../infrastructure/addresses.repository";

export class DeleteAddressUseCase {
  constructor(private repository: IAddressesRepository) {}
  async execute(id: string) {
    return this.repository.deleteAddress(id);
  }
}

export class SetDefaultAddressUseCase {
  constructor(private repository: IAddressesRepository) {}
  async execute(id: string) {
    return this.repository.setDefaultAddress(id);
  }
}
