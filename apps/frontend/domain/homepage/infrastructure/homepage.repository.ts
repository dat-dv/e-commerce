import { API_ROUTES } from "@/constants/routes";
import { ApiResponse, TRequest } from "@/utils/request/request.types";
import { THomepageSection } from "../types/homepage.model";
import { IHomepageRepository } from "../types/homepage.repository.interface";
import { ProductMapper } from "../../products/infrastructure/products.mapper";
import { IHomepageSectionResponse } from "@ecommerce/shared";

export class HomepageRepository implements IHomepageRepository {
  constructor(private request: TRequest) {}

  async getSections(): Promise<ApiResponse<THomepageSection[]>> {
    const response = await this.request.get<IHomepageSectionResponse[]>(
      API_ROUTES.HOMEPAGE.SECTIONS,
    );

    return {
      ...response,
      data:
        response.data?.map((item) => ({
          ...item,
          section: {
            ...item.section,
            categories: item.section.categories?.map((c) => ({
              id: c.id,
              slug: c.slug,
              level: c.level,
              order: c.order,
              name: c.translations?.[0]?.name,
            })),
          },
          data: item.data?.map((p) => ProductMapper.toDomain(p)) || [],
          brands: item.brands?.map((b) => ({
            id: b.id,
            name: b.name || "No Name",
            slug: b.slug,
            logo_url: b.logo_url || undefined,
            product_count: b.product_count,
          })),
        })) || [],
    };
  }
}
