import type {
  IApiResponse,
  IProductListResponse,
  IProductResponse,
} from "@ecommerce/shared";

export interface IAdminProductRepository {
  getProducts(
    page: number,
    limit: number,
  ): Promise<IApiResponse<IProductListResponse>>;

  getProduct(slug: string): Promise<IApiResponse<IProductResponse>>;
}
