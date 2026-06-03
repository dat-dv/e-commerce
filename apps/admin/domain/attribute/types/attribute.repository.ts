import type { IAdminAttribute } from "@/domain/product";

export interface IAdminAttributeRepository {
  getAttributes(): Promise<IAdminAttribute[]>;
}
