import { appRequest } from "@/utils/request/request";
import { BrandsRepository } from "../infrastructure/brands.repository";
import { GetTopBrandsUseCase } from "./get-top-brands.use-case";

const repo = new BrandsRepository(appRequest);

export const brandsUseCase = {
  getTopBrands: new GetTopBrandsUseCase(repo),
};
