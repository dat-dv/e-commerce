import { API_ROUTES } from "@/constants/routes";
import { ApiResponse, TRequest } from "@/utils/request/request.types";
import { THomepageSection } from "../types/homepage.model";
import { IHomepageRepository } from "../types/homepage.repository.interface";
import { ProductMapper } from "../../products/infrastructure/products.mapper";
import { BrandMapper } from "../../brands/infrastructure/brands.mapper";
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
          section: {
            id: item.section.id,
            title: item.section.translations?.[0]?.title || "",
            type: item.section.type,
            categories: item.section.categories?.map((c) => ({
              id: c.id,
              slug: c.slug,
              level: c.level,
              order: c.order,
              name: c.translations?.[0]?.name || c.slug,
            })),
          },
          data: item.data?.map((p) => ProductMapper.toDomain(p)) || [],
          brands: item.brands?.map((b) => BrandMapper.toDomain(b)),
        })) || [],
    };
  }
}
