import type { IAdminAttribute } from "@/domain/product";
import { UseCase } from "@/utils/use-case";

import type { IAdminAttributeRepository } from "../types/attribute.repository";

export class GetAttributesUseCase extends UseCase<
  void,
  Promise<IAdminAttribute[]>
> {
  constructor(private repository: IAdminAttributeRepository) {
    super();
  }

  async execute(): Promise<IAdminAttribute[]> {
    return this.repository.getAttributes();
  }
}
