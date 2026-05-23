import { appRequest } from "@/constants/app-request";
import { AddressesRepository } from "./infrastructure/addresses.repository";
import { CreateAddressUseCase } from "./use-cases/create-address.use-case";
import {
  DeleteAddressUseCase,
  SetDefaultAddressUseCase,
} from "./use-cases/delete-address.use-case";
import {
  GetAddressesUseCase,
  GetDefaultAddressUseCase,
} from "./use-cases/get-addresses.use-case";
import { UpdateAddressUseCase } from "./use-cases/update-address.use-case";

const repo = new AddressesRepository(appRequest);

export const addressesUseCase = {
  getAddresses: new GetAddressesUseCase(repo),
  getDefaultAddress: new GetDefaultAddressUseCase(repo),
  createAddress: new CreateAddressUseCase(repo),
  updateAddress: new UpdateAddressUseCase(repo),
  deleteAddress: new DeleteAddressUseCase(repo),
  setDefaultAddress: new SetDefaultAddressUseCase(repo),
};
