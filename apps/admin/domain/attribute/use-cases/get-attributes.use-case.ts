import type { IApiResponse, IAttributeListResponse } from "@ecommerce/shared";

import { UseCase } from "@/utils/use-case";

import type { IAdminAttributeRepository } from "../types/attribute.repository";

export class GetAttributesUseCase extends UseCase<
  void,
  Promise<IApiResponse<IAttributeListResponse>>
> {
  constructor(private repository: IAdminAttributeRepository) {
    super();
  }

  async execute(): Promise<IApiResponse<IAttributeListResponse>> {
    return this.repository.getAttributes();
  }
}
