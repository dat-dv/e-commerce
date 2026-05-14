import { appRequest } from "@/utils/request/request";
import { AddressesRepository } from "./infrastructure/addresses.repository";
import {
  GetAddressesUseCase,
  GetDefaultAddressUseCase,
} from "./use-cases/get-addresses.use-case";
import { CreateAddressUseCase } from "./use-cases/create-address.use-case";

const repo = new AddressesRepository(appRequest);

export const addressesUseCase = {
  getAddresses: new GetAddressesUseCase(repo),
  getDefaultAddress: new GetDefaultAddressUseCase(repo),
  createAddress: new CreateAddressUseCase(repo),
};
