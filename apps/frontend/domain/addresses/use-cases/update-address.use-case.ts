import { TCreateAddressInput } from "../types/address.model";
import { IAddressesRepository } from "../infrastructure/addresses.repository";

export class UpdateAddressUseCase {
  constructor(private addressesRepository: IAddressesRepository) {}

  async execute(id: string, data: Partial<TCreateAddressInput>) {
    return this.addressesRepository.updateAddress(id, data);
  }
}
