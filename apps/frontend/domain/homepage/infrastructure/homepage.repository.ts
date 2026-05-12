import { API_ROUTES } from "@/constants/routes";
import { ApiResponse, TRequest } from "@/utils/request/request.types";
import { IHomepageSection } from "../types/homepage.model";
import { IHomepageRepository } from "../entities/homepage.repository.interface";
import { ProductMapper } from "../../products/infrastructure/products.mapper";
import { IHomepageSectionResponse } from "../types/homepage.response";

export class HomepageRepository implements IHomepageRepository {
  constructor(private request: TRequest) {}

  async getSections(lang = "vi"): Promise<ApiResponse<IHomepageSection[]>> {
    const response = await this.request.get<IHomepageSectionResponse[]>(
      API_ROUTES.HOMEPAGE.SECTIONS,
      { params: { lang } },
    );

    return {
      ...response,
      data:
        response.data?.map((item) => ({
          ...item,
          category: {
            ...item.category,
            categories: item.category.categories?.map((c) => ({
              id: c.id,
              slug: c.slug,
              level: c.level,
              order: c.order,
              name: c.translations?.[0]?.name,
            })),
          },
          data: item.data?.map((p) => ProductMapper.toDomain(p)) || [],
        })) || [],
    };
  }
}
