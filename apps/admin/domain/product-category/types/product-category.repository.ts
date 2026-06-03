import type { IAdminCategory } from "@/domain/product";

export interface IAdminProductCategoryRepository {
  getCategoryTree(): Promise<IAdminCategory[]>;
}
