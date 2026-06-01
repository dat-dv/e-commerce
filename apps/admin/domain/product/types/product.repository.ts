import type {
  IApiResponse,
  IProductListResponse,
  IProductResponse,
  IUpdateProductRequest,
} from "@ecommerce/shared";

export interface IAdminProductRepository {
  getProducts(
    page: number,
    limit: number,
    search?: string,
  ): Promise<IApiResponse<IProductListResponse>>;

  getProduct(slug: string): Promise<IApiResponse<IProductResponse>>;

  updateProduct(
    id: string,
    data: IUpdateProductRequest,
  ): Promise<IApiResponse<IProductResponse>>;
}
