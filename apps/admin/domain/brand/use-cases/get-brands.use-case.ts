import type {
  IApiResponse,
  IBrandListResponse,
  IGetBrandListRequest,
} from "@ecommerce/shared";

import { UseCase } from "@/utils/use-case";

import type { IAdminBrandRepository } from "../types/brand.repository";

export class GetBrandsUseCase extends UseCase<
  IGetBrandListRequest | undefined,
  Promise<IApiResponse<IBrandListResponse>>
> {
  constructor(private repository: IAdminBrandRepository) {
    super();
  }

  async execute(
    request?: IGetBrandListRequest,
  ): Promise<IApiResponse<IBrandListResponse>> {
    return this.repository.getBrands(request);
  }
}
